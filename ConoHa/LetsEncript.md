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

## 自動更新

以下の様に `letsencrypt-auto` コマンドを実行すると、証明書を更新できます。

```
./letsencrypt-auto renew
```
もちろんWebサーバーを落として、上のコマンドを実行して、再度起動する必要があります。

面倒なので、スクリプトを用意して、crontabで実行します。

```
#!/bin/sh

echo "==== Update ===="

/bin/date

# Prepare env.

echo "==== Stop server."
# Stop server.

echo "==== Update cert."
cd /PATH/TO/letsencrypt
./letsencrypt-auto renew

echo "==== Start server."
# Start server.
```

コメントがある部分と `/PATH/TO/letsencrypt` は適切に設定します。
例えばNode.jsを使っている場合、 `npm` が必要になるので、nvm使用時には `. /usr/local/nvm/nvm.sh` を実行して、PATHを通して置く必要があります。
次にこれをcrontabで実行できるようにしておきます。

```
15 3 1 * * /PATH/TO/SCRIPT >> /PATH/TO/LOG 2>&1
```
期限切れが3ヶ月とかそれくらいだった気がするので、だいたい一ヶ月に一回更新処理を走らせれば問題ないでしょう。

上の例だと毎月1日の午前3時15分に自動的にサーバーを落として証明書を更新し、サーバーを起動します。
