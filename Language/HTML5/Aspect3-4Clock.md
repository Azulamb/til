# アスペクト比3:4(縦長)のブロック

とりあえずサンプルとして。
スマートフォンの縦長に合わせて、アスペクト比3:4のブロックのみを中央に表示するサンプル。

## ソース

``` html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title></title>
<style>
html {
	padding: 0;
	margin: 0;
	height: 100%;
}

body {
	padding: 0;
	margin: 0;
	height: 100%;
	overflow: hidden;
	position: relative;
}

article {
	padding: 0;
	margin: auto;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100vmin;
	height: calc( 400vmin / 3 );
	background-color: lightgray;
}

@media screen and (min-aspect-ratio: 3/4) {
	article { width: 75vmax; height: 100vmax; }
}

@media screen and (min-aspect-ratio: 1/1) {
	article { width: 75vmin; height: 100vmin; }
}
</style>
</head>
<body>
<article>
</article>
</body>
</html>
```

パターンは3つ。

* アスペクト比を維持した場合、高さが足りない場合
	* 横幅=vminで、横幅100vmin、高さは400vmin/3になる。
* アスペクト比を維持した場合、高さが最大だが、横幅は高さより小さい。
	* 理論上、ここから先は高さが最大で横幅を制限する。ただしvmax、vminを使う場合、高さの基準が異なる。
	* この場合高さ=vmaxで、横幅75vmax、高さ100vmaxになる。
* アスペクト比を維持した場合、高さが最大で画面は横長。
	* この場合高さ-vminで、横幅が75vmin、高さ100vminになる。

縦長の場合は、75とか4/3辺りを修正すればいける。
