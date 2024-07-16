---
title: Docker 安装 OpenVPN & 使用
tags: 
  - Docker
  - OpenVPN
  - VPN
---
<!-- more -->

## 1. 拉取 Docker 镜像

```bash
docker pull kylemanna/openvpn:2.4
```

## 2. 运行 Docker 镜像

```bash
mkdir -p /data/openvpn
docker run -v /data/openvpn:/etc/openvpn --rm kylemanna/openvpn ovpn_genconfig -u udp://{替换成你的公网IP}
```

## 3. 初始化密钥文件

⚠️  执行后有三处需要人工介入

1. 设置ca密码(建议不要太复杂，123123 即可)， 设置一个自己记得住的就可以了。确认后还要在输入一边相同的

2. Common Name可不设置直接按回车继续默认是server
3. 接着需要输入 ca密码 更新密钥库以及生成crl文件；

```bash
docker run -v /data/openvpn:/etc/openvpn --rm -it kylemanna/openvpn ovpn_initpki
```

## 4. 生成客户端证书

⚠️  执行后需要输入密码， 就是上面设置的 ca 密码

```bash
docker run -v /data/openvpn:/etc/openvpn --rm -it kylemanna/openvpn easyrsa build-client-full openvpn-client nopass
```

## 5. 导出客户端的配置文件openvpn-client.ovpn

```bash
docker run -v /data/openvpn:/etc/openvpn --rm -it kylemanna/openvpn easyrsa build-client-full openvpn-client nopass	
```

## 6. 导出客户端的配置文件openvpn-client.ovpn

```bash
docker run -v /data/openvpn:/etc/openvpn --rm kylemanna/openvpn ovpn_getclient openvpn-client > /data/openvpn/openvpn-client.ovpn
```

## 7. 启动openvpn server

```
docker run  -v /data/openvpn:/etc/openvpn \
-d -p 1194:1194/udp --restart=always --name openvpn \
--cap-add=NET_ADMIN --sysctl net.ipv6.conf.all.disable_ipv6=0 \
--sysctl net.ipv6.conf.default.forwarding=1 --sysctl net.ipv6.conf.all.forwarding=1  \
kylemanna/openvpn
```



这个时候 openvpn 配置文件就出现在 /data/openvpn/ 目录下了。 使用 SFTP 导出配合 OpenVPN Client 就可以使用了。



⚠️ 注意防火墙是否关闭，没关闭需要开放1194为udp端口。到这里openvpn服务端就安装完成了。

**Ubuntu 22.04**

```
# 安装 ufw
sudo apt update
sudo apt install ufw

# 设置开发 1194/udp 端口
sudo ufw allow ssh
sudo ufw allow 1194/udp
sudo ufw enable
```



安装 OpenVPN 客户端

[Community Downloads - Open Source VPN | OpenVPN](https://openvpn.net/community-downloads/)











