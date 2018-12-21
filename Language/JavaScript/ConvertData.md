# データ変換周りの処理

たまによく使うけど毎度ググるのでまとめておく。

## 小技：fetchを用いた変換[ブラウザ]

例えば画像を表示する時にBase64変換したのを使ったりすることもあると思います。

```
# 1x1の黒GIF
data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=
```

これをfetchに与えるとそのまま解釈してくれるので、以下のようにしてGIFのUint8Arrayを入手できたりします。

```
const dataurl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
const p = fetch( dataurl ).then( ( result ) => { return result.arrayBuffer(); } );
p.then( ( result ) => { console.log(new Uint8Array( result )); } );
```
