# サーバー立てたのにアクセスできない

新しい方のConoHaではセキュリティが強化された状態が初期状態です。

GUIからそれっぽい値のチェックを付けても、Webサーバーにアクセスできなかったのでメモ書き。

## ファイアウォール

ConoHaはデフォルトでファイアウォールがオンです。

CentOSで例えばWebサーバーを使えるようにするには、次のようなコマンドを打ち込む必要があります。

### 確認

```
firewall-cmd --list-all
public (default, active)
  interfaces: eth0
  sources: 
  services: dhcpv6-client ssh
  ports: 
  masquerade: no
  forward-ports: 
  icmp-blocks: 
  rich rules: 
```

### HTTP通信の有効化

1行目のコマンドはroot権限が必要なので、一般ユーザーの場合は `sudo` を付けてください。

```
firewall-cmd --permanent --add-service=http --zone=public
firewall-cmd --reload
```

### 確認

```
firewall-cmd --list-all
public (default, active)
  interfaces: eth0
  sources: 
  services: dhcpv6-client http ssh
  ports: 
  masquerade: no
  forward-ports: 
  icmp-blocks: 
  rich rules: 
```

httpが追加されています。

## その他

Let's Encryptは確かHTTP/HTTPSサーバーを一度立てて作業するので、この作業に追加でhttpsも有効にしないと動かないはず（まだ失敗した後できる確認はしてない）。
