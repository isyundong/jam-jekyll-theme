---
title: NVIDIA驱动失效简单解决方案：NVIDIA-SMI has failed because it couldn‘t communicate with the NVIDIA driver.
tags: 
  - NVIDIA
  - BUG
---
<!-- more -->


跑模型时显示只用到了 CPU。 CUDA 没有利用到
![image-20240418120245712](./assets/image-20240418120245712.png)



打开终端，`nvidia-smi`查看一下，发现如下报错：

> NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver. 
> Make sure that the latest NVIDIA driver is installed and running.



使用`nvcc -V`检查驱动和cuda。发现一切正常





**解决办法**

1. 查看已安装驱动的版本信息

   ```
   ls /usr/src | grep nvidia
   
   得到驱动版本 550.54.14
   ```


2. 安装 dmks

   ``` 
   apt-get install dkms
   ```

3. 重新注册驱动

   ```
   dkms install -m nvidia -v 550.54.14
   ```

4. 等待安装完成后，再次输入`nvidia-smi`，查看GPU使用状态

​	<img src="assets/image-20240418120720998.png" alt="image-20240418120720998" style="zoom:50%;" />

