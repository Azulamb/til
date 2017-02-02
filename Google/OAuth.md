# GoogleのOAuth認証周りの手続き

今回はユーザー情報として名前とメールアドレスを取得するための準備です。

https://console.developers.google.com/


## プロジェクトを作成

* プロジェクト名に適当な名前を付ける
* Google+ APIを有効にする

## 認証情報の作成

* OAuthクライアントIDの作成
* アプリケーションの種類はWebアプリケーション
* 認証済みリダイレクトURIに `http://ドメイン/auth/google/callback` のようにリダイレクトURLを追加する。
    * ローカルで試すなら、 `http://localhost:8080/auth/google/callback` みたいな感じ。
    * 某どこかと違ってlocalhostみたいなのでも許容する。

## 作成完了

* ポップアップで出るクライアントIDとクライアントシークレットをコピー

## トークン取得周り

* scopeに `https://www.googleapis.com/auth/plus.login` を入れる
