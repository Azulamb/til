# JS側の処理について

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly

色々あるのでまとめ。

## 主要なAPIと関係

### WebAssembly.validate( buf: TYPED_ARRAY | ArrayBuffer ): boolean

型付配列かArrayBufferを渡すとそれが有効なWebAssemblyのバイナリデータか判別してくれる。
こいつは独立していると考えて良い。

### WebAssembly.compile( buf: TYPED_ARRAY | ArrayBuffer ): Promise<WebAssembly.Module>

型付配列かArrayBufferを渡すとそれをコンパイルして使えるようにする。
出力結果として `WebAssembly.Module` を返す。

普通は読み込みと同時に使うので使う機会はほぼないが、例えばインスタンス化して複数の使う（乱数とか）の場合には使うこともある。

### new WebAssembly.Instance( mod: WebAssembly.Module, obj?: any )

上で得た `WebAssembly.Module` と中で呼び出しているJS関数等を登録するオブジェクトを渡すことでインスタンス化を行う。
ちなみにWebAssembly内で使われているJSの側のオブジェクトがないとインスタンス化に失敗する。

```js
const mod = await WebAssembly.compile( buf );
const instance = new WebAssembly.Instance( mod, {} );
```

だいたいこんな感じの流れで使う。

インスタンス内には `exports` があり、この中にWebAssemblyでexportした関数などが格納されている。

### WebAssembly.instantiate( buf: TYPED_ARRAY | ArrayBuffer, obj?: any ): Promise<{ module: WebAssembly.Module, instance: WebAssembly.Instance }>

型付配列かArrayBufferと取り込むオブジェクトを渡すと `WebAssembly.Module` とインスタンス化したオブジェクトが返される。

非同期関数で一気に色々やってくれるので一度しか使わないならこれでよし。

しかし一度使うなら下の方が楽で良いと思う。

### WebAssembly.instantiateStreaming( src: Response | Promise<Response>, obj?: any ): Promise<{ module: WebAssembly.Module, instance: WebAssembly.Instance }>

`Response` もしくは `Promise<Response>` と取り込むオブジェクトを渡すと `WebAssembly.Module` とインスタンス化したオブジェクトが返される。
早い話第一引数には `fetch()` を渡せばOK。

```js
WebAssembly.instantiateStreaming( fetch( './app.wasm' ), {} ).then( ( wasm ) => {} ):
```

`fetch()` と `WebAssembly.instantiate()` のあわせ技で実装は難しくないと思うが、正直一度使うだけならこれを実行するだけで良い。
