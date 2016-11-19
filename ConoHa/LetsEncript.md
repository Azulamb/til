# Let's EncryptでHTTPS証明書の取得

無料でHTTPSの証明書を発行できるLet's EncryptをConoHaで取得します。

CentOS 7です。

## 下準備

### ドメインの設定

ConoHaの提供するDNSで特定のドメインを管理できるようにしておく必要があります。

もし `example.com` を取得して色々使っていて、`conoha.example.com` 以下だけをConoHaの管理下に置きたい場合は[DNSの設定](Domain.md)にあるように、レジストラにNSレコードを追加してください。

ちゃんと指定のドメインでVPSにアクセスできるようになれば大丈夫です。

### ポート開放

[こちら](Server.md) にあるように、ConoHaは最初Firewallでほとんどの通信が切られています
証明書の特にhttp/https(80/443)ポートの開放が必要なので、開放します。

### 必要なアプリケーションとか

次に必要なものをインストールします。

面倒なのでroot権限で作業します。

```
yum install epel-release
yum install certbot python-certbot-apache
```

## 証明書の入手

めんどうなのでroot権限で作業します。

適当な作業ディレクトリを作ってそこに移動してください。

```
git clone https://github.com/letsencrypt/letsencrypt
cd letsencrypt/
```

ここで次のようなコマンドを実行して、証明書を入手します。

```
./letsencrypt-auto certonly --standalone --email your@email.address -d conoha.example.com
```

`--email` にはあなたのメールアドレスを指定してください。

`-d` には発行するドメインを指定してください。

実行後、次のように表示されれば成功です。

```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at
   /etc/letsencrypt/live/conoha.example.com/fullchain.pem. Your cert
   will expire on 2017-02-17. To obtain a new or tweaked version of
   this certificate in the future, simply run letsencrypt-auto again.
   To non-interactively renew *all* of your certificates, run
   "letsencrypt-auto renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

これで `/etc/letsencrypt/live/conoha.example.com/` に証明書がダウンロードされます。
