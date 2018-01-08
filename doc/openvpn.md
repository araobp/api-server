# OpenVPN setup tips

This is a tip for creating VPN of 10.8.0.0/24 only among multiple RasPi and PC: default route is still via existing defafult GW.

## Config for OpenVPN client

The following config works for both Linux and Windows (except "log-append" line).

Example client config
```
client

dev    tun
proto  tcp

remote <IP address of OpenVPN server> 443

resolv-retry  infinite
nobind

persist-key
persist-tun

ca    ca.crt
cert  raspi1.crt
key   raspi1.key

comp-lzo
verb 3

log-append /var/log/openvpn.log

route-nopull
route 10.8.0.0 255.255.255.0
```

"route" options in the config above avoid overwriting default config.

"cert" and "key" lines must be modified for each RasPi and PC: "raspi1.crt", "raspi1.key", "raspi2.crt", "raspi2.key"...
