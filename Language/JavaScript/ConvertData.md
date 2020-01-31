# データ変換周りの処理

たまによく使うけど毎度ググるのでまとめておく。

## ArrayBuffer → TypedArray

```js
const buf    = new ArrayBuffer( 100 );
const int8   = new Int8Array( buf );
const uint8  = new Uint8Array( buf );
const uint8c = new Uint8ClampedArray( buf );
const int16  = new Int16Array( buf );
const uint16 = new Uint16Array( buf );
const int32  = new Int32Array( buf );
const uint32 = new Uint32Array( buf );
```

## File/Blob → ArrayBuffer, DataURL

```js
new Promise( ( resolve, reject ) => {
	const reader = new FileReader();
	reader.onabort = reject;
	reader.onerror = reject;
	reader.onload = ( event ) => {
		resolve( event.target.result );
	};
	reader.readAsArrayBuffer( file );
	//reader.readAsDataURL( file );
	//reader.readAsArrayBuffer( new Blob( [ <Uint8Array>this.zip.get( file ) ] ) );
} );
```

## Uint8Array → (Blob) → HTMLImageElement

```js
// data: Uint8Array
new Promise<HTMLImageElement>( ( resolve, reject ) => {
	const image = document.createElement( 'img' );
	image.onload = () => { resolve( image ); };
	const error = ( event: ProgressEvent|UIEvent ) => { reject( new Error( 'Load error:' + file ) ); };
	image.onabort = error;
	image.onerror = error;

	const reader = new FileReader();
	reader.onload = ( event ) => { image.src = <string>reader.result; };
	reader.onabort = error;
	reader.onerror = error;
	reader.readAsDataURL( new Blob( [ data ] ) );
} );
```

他テキストとかもいけるけど今回はTypedArray周りがメインなので省略。

## 文字列 → Uint8Array → 文字列

UTF-8のバイト列になるとか。

```js
const byte = new TextEncoder().encode( 'Test' );
const str = new TextDecoder().decode( byte );
```

## UTF-16 → 文字列

上はUTF-8だがこっちはUTF-16なので注意。
なおASCIIだけならUint8Arrayでもいける。（配列の1つの値をUTF-16の文字コードとして認識して変換）

```js
String.fromCharCode.apply( null, new Uint16Array( response.data ) );
```

## 小技：fetchを用いた変換[ブラウザ]

例えば画像を表示する時にBase64変換したのを使ったりすることもあると思います。

```js
# 1x1の黒GIF
data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=
```

これをfetchに与えるとそのまま解釈してくれるので、以下のようにしてGIFのUint8Arrayを入手できたりします。

```js
const dataurl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
const p = fetch( dataurl ).then( ( result ) => { return result.arrayBuffer(); } );
p.then( ( result ) => { console.log( new Uint8Array( result ) ); } );
```
