# ビルド設定をファイルに分離する

コンパイラには様々な引数を与えて挙動を変えることができるのですが、それをIDEなどが解釈して設定するのは困難です。
そのため各IDEなどは独自に設定を持ってコンパイラに渡す引数を作るため、他の環境での互換性がありません。

しかしTypeScriptでは、ビルド設定をJSONファイルに分離することができます。
このファイルが `tsconfig.json` なのですが、これが非常に便利なのでそれについてまとめます。

他のコンパイラも採用してほしい。

## 仕組み

`tsconfig.json` というファイルにビルド設定を書き、`tsc` コマンドを実行すると、自動的にそこに書かれているオプションでビルドを行います。

また、`tsc --project ディレクトリ名` で、そのディレクトリにある `tsconfig.json` を元にビルドします。
サーバーとクライアントでソースコードを分ける場合、ディレクトリに分けてそこに個別の `tsconfig.json` を用意すれば良いです。

## サンプル

ディレクトリ構成は以下とします。

```
+ プロジェクトディレクトリ/
  + app/        ... サーバー側のJS格納場所
  + docs/       ... クライアント側のJS格納場所
  + src/        ... サーバーとクライアントのソースファイルの格納場所
    + client/   ... クライアント側のソースファイル格納場所
      + main.ts
      + tsconfig.json
    + server/   ... サーバー側のソースファイル格納場所
      + main.ts
      + tsconfig.json
```

### クライアント側

目標

* `./docsapp.js` の1ファイルに結合して出力する
* 出力ターゲットはES5
* Promiseとか使いたいので、開発中のターゲットはES2017(出力ターゲットに合わせるとPromiseなどはデフォルトでないので使えない)

```
{
	"compilerOptions": {
		"outFile": "../../docs/app.js",
		"module": "system",
		"moduleResolution": "node",
		"target": "es5",
		"lib": [
			"dom",
			"es2017"
		],
		"strictNullChecks": true,
		"noImplicitAny": true,
		"removeComments": true,
		"preserveConstEnums": false,
		"sourceMap": false
	},
	"include": [
		"./src/*.ts"
	]
}
```

### サーバー側

目標

* `app/` 以下に `src/server/` 以下のtsファイルの構成をそのままコピーしてもってきたい(一つにまとめない)
* 実行環境は最新に対応できるので、ターゲットはES6

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
