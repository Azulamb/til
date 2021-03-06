# ConoHaで独自ドメイン

ConoHaのVPSに独自ドメインを割り当てるとき、ConoHaのDNSに管理させることが可能です。
場合によってはこれが必要なので、以下のような条件で使えるようにします。

* Value-Domainなどレコードを登録できるサービスで、`example.com` を取得。
* ConoHaには `conoha.example.com` 以下のドメインを管理してもらう。

## レジストラの設定

レジストラが提供するネームサーバーの変更機能は、ドメインの設定すべてをどこに回すかなので、すでにレジストラでいくつもドメインを管理している場合は面倒です。

今回であれば `example.com` 内の `conoha.example.com` だけをConoHaのDNSに管理させたい場合、以下のNSレコードを直に追加します。

```
ns-a1.conoha.io.
ns-a2.conoha.io.
ns-a3.conoha.io.
```

このレコードが追加できないレジストラは諦めて移植するなり何なりしてください。

### Value-Domainでの設定

ログインしていなければログイン。
ログインしていればコントロールパネルに移動します。

そこから無料ネームサーバー→ドメインのDNS設定とページを移動し、契約中のドメインのDNSを編集してください。

後は以下のNSレコードを追加すれば終了です。

```
ns conoha ns-a1.conoha.io.
ns conoha ns-a2.conoha.io.
ns conoha ns-a3.conoha.io.
```

## ConoHaの設定

ConoHaは次のようにドメインを設定します。

### DNSにドメイン追加

管理ページログイン後、左メニューのDNSに入り、ドメインを追加します（今回は `conoha.example.com` ）。

ドメイン名を入力するだけで追加は可能です。

追加されたら、次のレコードを登録します。

| タイプ | 名称 | TTL | 値 |
|--------|------|-----|----|
| A      | @    | 3600 | IPアドレス |

### 逆引き設定

次に逆引きの設定もしておきます。

左メニューのサーバーから、設定するVPSの設定を開きます。

VPS設定の中に、PTRレコードなるものがあります。

ここのIPv4に設定するドメイン（今回は `conoha.example.com` ）を追加します。

これでConoHa側の設定は終わりです。

## 最後に

しばらく待つと反映されます。

digコマンドなどではちゃんと確認できるはずです。
確認したい場合は、レジストラのDNSサーバーを、指定してdigコマンドを実行してください。

以下ような感じになればそのうち反映されます。

```
;; ANSWER SECTION:
conoha.example.com.	3539	IN	A	IPアドレス

;; AUTHORITY SECTION:
conoha.example.com.	59	IN	NS	ns-a1.conoha.io.
conoha.example.com.	59	IN	NS	ns-a3.conoha.io.
conoha.example.com.	59	IN	NS	ns-a2.conoha.io.
```
