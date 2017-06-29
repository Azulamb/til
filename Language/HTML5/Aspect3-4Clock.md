# アスペクト比3:4(縦長)のブロック

とりあえずサンプルとして。
スマートフォンの縦長に合わせて、アスペクト比3:4のブロックのみを中央に表示するサンプル。

## HTML5

```
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

canvas {
	display: block;
	width: 100%;
	height: 100%;
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
