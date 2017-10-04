# HTMLのスタイル周りのあれこれ

# ルールの取得

`document.styleSheets` にスタイルのデータが入っていて、`<style>` 1つに付き1つの `styleSheet` があります。

その `styleSheet` 内には1つのセレクタごとに1つのデータが入っています。

```
var styleSheets = document.styleSheets;
for ( var i = 0; i < styleSheets.length; ++i ) {
	var styleSheet = styleSheets[ i ];
	var rules = styleSheet.rules || styleSheet.cssRules;
	console.log( rules );
}
```

以下サンプルでは上の変数名の内容に対する処理を書きます。

# スタイルの修正

```
rules[ 0 ].style.backgroundColor = 'red';
```

みたいな感じでやると、他の要素のスタイル修正の感覚で編集可能。

# スタイルを丸ごと書き換える。

`<style>`の中身を丸ごと書き換えたい場合だあると思う。
上の手法でちまちまやっていると日が暮れるので、以下の方法でまとめて書き換え可能。

```
styleSheet.ownerNode.textContent = 'NEW CSS DATA';
```

`styleSheet.ownerNode` が `<style>` 本体なので、こいつの中のコンテンツを書き換えるという力技がこれ。
