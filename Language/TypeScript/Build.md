# ビルド周りのメモ

毎度書くのが面倒なので、自分のビルド周りのファイルをメモ。

## 基本方針

`tsc` に `tsconfig.json` を読み込ませてビルドします。

これにより、サーバーとクライアントの2つの環境があっても同時に開発・ビルドが可能で、また `package.json` にスクリプトを追加することで、`npm run build` などで簡単にビルドできるようになります。

## ディレクトリ構成

```
app/ ... サーバービルド後の格納場所
  Main.js ... サーバーの起動ファイル
docs/ ... クライアントビルド後の格納場所
  app.js
src/
  client/
    tsconfig.json
  server/
    tsconfig.json
package.json
```

## package.json

```
{
  ... 省略 ...
  "scripts": {
    "build": "npm run sbuild & npm run cbuild",
    "sbuild": "tsc --project src/server",
    "cbuild": "tsc --project src/client",
    "server": "node ./app/Main.js"
  },
  ... 省略 ...
}
```

主に追加したコマンド

* build
    * `sbuild` と `cbuild` を行う。
* cbuild
    * クライアント側のビルド。
* sbuild
    * サーバー側のビルド。
* server
    * サーバーの実行。

## tsconfigの内容

[こちらを参照](tsconfig.md)

