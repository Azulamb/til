# Let's EncryptでHTTPS証明書の取得

無料でHTTPSの証明書を発行できるLet's EncryptをConoHaで取得します。

CentOS 7です。

## 下準備

### ポート開放

[Server立てたのにつながらない](Server.md) にあるように、ConoHaは最初Firewallでほとんどの通信が切られています
証明書の特にhttp/https(80/443)ポートの開放が必要なので、開放します。

### 必要なアプリケーションとか

次に必要なものをインストールします。

面倒なのでroot権限で作業します。

```
yum install epel-release
yum install certbot python-certbot-apache
```

domain

git
