# 初めてのTypeScript

まず適当なフォルダを作り、`hello.ts` を以下の内容で作成します。

```
console.log( 'Hello!' );
```

次に以下コマンドでビルドを行います。

```
tsc hello.js
```

ビルド結果として、`hello.js` が出力されたと思いますので、これをNode.jsで実行します。

```
node hello.js
```

以下のように出力されればOKです。

```
Hello!
```

# 型エラーを見る

