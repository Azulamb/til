# アスペクト比を維持したブロック

とりあえず前回アスペクト比を頑張って維持したが、それより簡単＋2行いじるだけで任意のアスペクト比のブロックを作るコードができたので置いておく。

なお条件は以下。

* ブロックのアスペクト比はページの大きさ依存
    * vhとかvw使ってるので。
    * 今回のサンプルではページ内で最大のアスペクト比を維持したブロックを中央に描画する。

## 9:16(縦長)のコード

```
<!DOCTYPE html>
<html lang="ja" style="font-size:20px;">
<head>
<style type="text/css">html{height:100%;}body{padding:0;margin:0;height:100%;overflow:hidden;position:relative;}article{padding:0;margin:auto;position:absolute;top:0;bottom:0;left:0;right:0;background-color:lightgray;}</style>
<style type="text/css">
:root { --as-width: 9; --as-height: 16; }
article { width:100vw; height:calc( var(--as-height) * 100vw / var(--as-width) ); }
@media screen and ( min-aspect-ratio: 9/16 ) { article { width: calc( var(--as-width) * 100vh / var(--as-height) );height: 100vh; } }
</style>
</head>
<body>
	<article></article>
</body>
</html>
```

### 編集箇所

9と16のある4箇所2行を編集することで別のアスペクト比にすることが可能です。
例えば4:3(横長)は以下になります。

```
<!DOCTYPE html>
<html lang="ja" style="font-size:20px;">
<head>
<style type="text/css">html{height:100%;}body{padding:0;margin:0;height:100%;overflow:hidden;position:relative;}article{padding:0;margin:auto;position:absolute;top:0;bottom:0;left:0;right:0;background-color:lightgray;}</style>
<style type="text/css">
:root { --as-width: 4; --as-height: 3; }
article { width:100vw; height:calc( var(--as-height) * 100vw / var(--as-width) ); }
@media screen and ( min-aspect-ratio: 4/3 ) { article { width: calc( var(--as-width) * 100vh / var(--as-height) );height: 100vh; } }
</style>
</head>
<body>
	<article></article>
</body>
</html>
```
