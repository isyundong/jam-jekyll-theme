---
title: Java本地缓存技术选型（Guava Cache、Caffeine、Encache）
tags: 

- 缓存
- Java

---

<!-- more -->

### 前言

对一个java后台开发者而言，提到缓存，第一反应就是redis和memcache。利用这类缓存足以解决大多数的性能问题了，并且java针对这两者也都有非常成熟的api可供使用。但是我们也要知道，这两种都属于remote cache（分布式缓存），应用的进程和缓存的进程通常分布在不同的服务器上，不同进程之间通过RPC或HTTP的方式通信。这种缓存的优点是缓存和应用服务解耦，支持大数据量的存储，缺点是数据要经过网络传输，性能上会有一定损耗。

与分布式缓存对应的是本地缓存，缓存的进程和应用进程是同一个，数据的读写都在一个进程内完成，这种方式的优点是没有网络开销，访问速度很快。缺点是受JVM内存的限制，不适合存放大数据。

本篇文章我们主要主要讨论Java本地缓存的的一些常用方案。

### 本地缓存常用技术

本地缓存和应用同属于一个进程，使用不当会影响服务稳定性，所以通常需要考虑更多的因素，例如容量限制、过期策略、淘汰策略、自动刷新等。常用的本地缓存方案有：

* 根据HashMap自实现本地缓存
* Guava Cache
* Caffeine
* Encache

下面分别进行介绍：

#### 1. 根据HashMap自定义实现本地缓存

缓存的本质就是存储在内存中的KV数据结构，对应的就是jdk中的HashMap，但是要实现缓存，还需要考虑并发安全性、容量限制等策略，下面简单介绍一种利用LinkedHashMap实现缓存的方式：

```java
public class LRUCache extends LinkedHashMap {

    /**
     * 可重入读写锁，保证并发读写安全性
     */
    private ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();
    private Lock readLock = readWriteLock.readLock();
    private Lock writeLock = readWriteLock.writeLock();

    /**
     * 缓存大小限制
     */
    private int maxSize;

    public LRUCache(int maxSize) {
        super(maxSize + 1, 1.0f, true);
        this.maxSize = maxSize;
    }

    @Override
    public Object get(Object key) {
        readLock.lock();
        try {
            return super.get(key);
        } finally {
            readLock.unlock();
        }
    }

    @Override
    public Object put(Object key, Object value) {
        writeLock.lock();
        try {
            return super.put(key, value);
        } finally {
            writeLock.unlock();
        }
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry eldest) {
        return this.size() > maxSize;
    }
}

```





LinkedHashMap维持了一个链表结构，用来存储节点的插入顺序或者访问顺序（二选一），并且内部封装了一些业务逻辑，只需要覆盖removeEldestEntry方法，便可以实现缓存的LRU淘汰策略。此外我们利用读写锁，保障缓存的并发安全性。需要注意的是，这个示例并不支持过期时间淘汰的策略。

自实现缓存的方式，优点是实现简单，不需要引入第三方包，比较适合一些简单的业务场景。缺点是如果需要更多的特性，需要定制化开发，成本会比较高，并且稳定性和可靠性也难以保障。对于比较复杂的场景，建议使用比较稳定的开源工具。

#### 2. 基于Guava Cache实现本地缓存

Guava是Google团队开源的一款 Java 核心增强库，包含集合、并发原语、缓存、IO、反射等工具箱，性能和稳定性上都有保障，应用十分广泛。Guava Cache支持很多特性：

* 支持最大容量限制
* 支持两种过期删除策略（插入时间和访问时间）
* 支持简单的统计功能
* 基于LRU算法实现

Guava Cache的使用非常简单，首先需要引入maven包：

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>18.0</version>
</dependency>
```

一个简单的示例代码如下：

```java
public class GuavaCacheTest {

    public static void main(String[] args) throws Exception {
        //创建guava cache
        Cache<String, String> loadingCache = CacheBuilder.newBuilder()
                //cache的初始容量
                .initialCapacity(5)
                //cache最大缓存数
                .maximumSize(10)
                //设置写缓存后n秒钟过期
                .expireAfterWrite(17, TimeUnit.SECONDS)
                //设置读写缓存后n秒钟过期,实际很少用到,类似于expireAfterWrite
                //.expireAfterAccess(17, TimeUnit.SECONDS)
                .build();
        String key = "key";
        // 往缓存写数据
        loadingCache.put(key, "v");

        // 获取value的值，如果key不存在，调用collable方法获取value值加载到key中再返回
        String value = loadingCache.get(key, new Callable<String>() {
            @Override
            public String call() throws Exception {
                return getValueFromDB(key);
            }
        });

        // 删除key
        loadingCache.invalidate(key);
    }

    private static String getValueFromDB(String key) {
        return "v";
    }
}
```





总体来说，Guava Cache是一款十分优异的缓存工具，功能丰富，线程安全，足以满足工程化使用，以上代码只介绍了一般的用法，实际上springboot对guava也有支持，利用配置文件或者注解可以轻松集成到代码中。

#### 3. Caffeine

Caffeine是基于java8实现的新一代缓存工具，缓存性能接近理论最优。可以看作是Guava Cache的增强版，功能上两者类似，不同的是Caffeine采用了一种结合LRU、LFU优点的算法：W-TinyLFU，在性能上有明显的优越性。Caffeine的使用，首先需要引入maven包：

```xml
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
    <version>2.5.5</version>
</dependency>
```



使用上和Guava Cache基本类似：



```java
public class CaffeineCacheTest {

    public static void main(String[] args) throws Exception {
        //创建guava cache
        Cache<String, String> loadingCache = Caffeine.newBuilder()
                //cache的初始容量
                .initialCapacity(5)
                //cache最大缓存数
                .maximumSize(10)
                //设置写缓存后n秒钟过期
                .expireAfterWrite(17, TimeUnit.SECONDS)
                //设置读写缓存后n秒钟过期,实际很少用到,类似于expireAfterWrite
                //.expireAfterAccess(17, TimeUnit.SECONDS)
                .build();

        String key = "key";
        // 往缓存写数据
        loadingCache.put(key, "v");

        // 获取value的值，如果key不存在，获取value后再返回
        String value = loadingCache.get(key, CaffeineCacheTest::getValueFromDB);

        // 删除key
        loadingCache.invalidate(key);
    }

    private static String getValueFromDB(String key) {
        return "v";
    }
}
```



相比Guava Cache来说，Caffeine无论从功能上和性能上都有明显优势。同时两者的API类似，使用Guava Cache的代码很容易可以切换到Caffeine，节省迁移成本。需要注意的是，SpringFramework5.0（SpringBoot2.0）同样放弃了Guava Cache的本地缓存方案，转而使用Caffeine。

#### 4. Encache

Encache是一个纯Java的进程内缓存框架，具有快速、精干等特点，是Hibernate中默认的CacheProvider。同Caffeine和Guava Cache相比，Encache的功能更加丰富，扩展性更强：

* 支持多种缓存淘汰算法，包括LRU、LFU和FIFO
* 缓存支持堆内存储、堆外存储、磁盘存储（支持持久化）三种
* 支持多种集群方案，解决数据共享问题

Encache的使用，首先需要导入maven包：



```xml
<dependency>
    <groupId>org.ehcache</groupId>
    <artifactId>ehcache</artifactId>
    <version>3.8.0</version>
</dependency>
```





以下是一个简单的使用案例：

```java
public class EncacheTest {

    public static void main(String[] args) throws Exception {
        // 声明一个cacheBuilder
        CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder()
                .withCache("encacheInstance", CacheConfigurationBuilder
                        //声明一个容量为20的堆内缓存
                        .newCacheConfigurationBuilder(String.class,String.class, ResourcePoolsBuilder.heap(20)))
                .build(true);
        // 获取Cache实例
        Cache<String,String> myCache =  cacheManager.getCache("encacheInstance", String.class, String.class);
        // 写缓存
        myCache.put("key","v");
        // 读缓存
        String value = myCache.get("key");
        // 移除换粗
        cacheManager.removeCache("myCache");
        cacheManager.close();
    }
}

```



### 总结

* 从易用性角度，Guava Cache、Caffeine和Encache都有十分成熟的接入方案，使用简单。
* 从功能性角度，Guava Cache和Caffeine功能类似，都是只支持堆内缓存，Encache相比功能更为丰富
* 从性能上进行比较，Caffeine最优、GuavaCache次之，Encache最差(下图是三者的性能对比结果）

<img src="./assets/7595634-cca21789a92fd855.png" title="" alt="" data-align="center">



总体来说，对于本地缓存的方案中，笔者比较推荐Caffeine，性能上遥遥领先。虽然Encache功能更为丰富，甚至提供了持久化和集群的功能，但是这些功能完全可以依靠其他方式实现。真实的业务工程中，建议使用Caffeine作为本地缓存，另外使用redis或者memcache作为分布式缓存，构造多级缓存体系，保证性能和可靠性。


