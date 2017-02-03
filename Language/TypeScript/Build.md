# ビルド周りのメモ

毎度書くのが面倒なので、自分のビルド周りのファイルをメモ。

## 基本方針

`tsc` に `tsconfig.json` を読み込ませてビルドします。

これにより、サーバーとクライアントの2つの環境があっても同時に開発・ビルドが可能で、また `package.json` にスクリプトを追加することで、`npm run build` などで簡単にビルドできるようになります。

## ディレクトリ構成

```
app/ ... サーバービルド後の格納場所
  Main.js ... サーバーの起動ファイル
public/ ... クライアントビルド後の格納場所
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

## クライアント側

```
{
	"compilerOptions": {
		"outFile": "../../public/app.js",
		"module": "system",
		"moduleResolution": "node",
		"target": "es5",
		"strictNullChecks": true,
		"noImplicitAny": true,
		"removeComments": true,
		"preserveConstEnums": false,
		"sourceMap": false
	},
	"include": [
		"./**/*.ts"
	]
}
```

`src/client/` 以下のTypeScriptファイルをすべてビルドして、`public/app.js` に固めます。

とりあえずES5に対応した出力にするようにしますが、モダンブラウザ向けならES6でもいいはず。

## サーバー側

```
{
	"compilerOptions": {
		"outDir": "../../app",
		"module": "commonjs",
		"target": "es6",
		"strictNullChecks": true,
		"noImplicitAny": true,
		"removeComments": true,
		"preserveConstEnums": false,
		"sourceMap": false
	},
	"include": [
		"./**/*.ts"
	]
}
```

`app/` 以下に各ファイルを個別にビルドして配置します。

必ず `Main.ts` というファイルを用意して、そこからサーバーが起動するようにします。

