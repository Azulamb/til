# 型定義周りのメモ

## 独自定義の型をサーバー/クライアント両方で参照する

TypeScriptでの実装メリットに、型が変わった時に明確にエラー個所が分かるという点があります。

これは例えばAPIでやり取りする場合、APIで受け渡しする型をサーバーとクライアント側で共通のものを利用すれば、片方の修正での影響範囲が明確に分かることになり、非常に便利です。

しかし、これを実際にやろうとすると、いくつか問題があります。

### 普通にビルドする場合に階層が意図せず深くなる

例えば以下の構造だった場合

```
build/ ... ここにビルド結果
src/
  types.ts ... ここに共通の型
  server/ ... ここにサーバー側の処理
    main.ts
    sub.ts
```

Server配下のみをビルドして `build/` に出力すると以下のようになります。

```
build/
  main.js
  sub.js
```

しかし、`common/` 内のファイルを取り込むようなコードが混じると、以下のようになります。

```
build/
  types.js
  server/
    main.js
    sub.js
```

types.jsの中身が空でも、import等を使えばこのような構造で出力されたりします。

### 解決策

`@types` の仕組みを使わせてもらいます。

具体的には `node_modules/@types/任意のディレクトリ/index.d.ts` に型定義を書いて、ビルドするようにします。

`@types` が使える環境であれば、問題なく使えるはず。

SublimeTextなどの自動補完が効かない場合、一旦再起動などしてみましょう。

## クラス定義を隠された状態でクラスを継承する

WebComponentsでは `HTMLElement` を継承してカスタム要素を定義します。
このカスタム要素を更に継承してもカスタム要素を作れますが、そのためには基本的にそのクラスがグローバル領域から見える必要があります。
 
```ts
// File: tag-a.ts
class A extends HTMLElement {}
customElements.define( 'tag-a', A ); 
```

```ts
// File: tag-b.ts
class B extends A {}
customElements.define( 'tag-a', B );
```

しかしクラス定義を隠した状態でも `customElements.get()` を使ってクラスを継承したいです。

```ts
 // File: tag-a.ts
interface AElement extends HTMLElement{}

( () =>
{
	class A extends HTMLElement implements AElement {}
	customElements.define( 'tag-a', A );
} )();
```

このような場合は以下のようにします。

```ts
// File: tag-b.ts
type AClass = new () => AElement;
interface BElement extends AElement {}

( () =>
{
	const A: AClass = customElements.get( 'tag-a' );
	class B extends A implements BElement {}
	customElements.define( 'tag-a', B );
} )();
```

継承する場合クラスはコンストラクタを持つ関数型なので、その型を `type` で定義してあげればエラーなく継承できます。

## 既存メソッドの型をオーバーロードしたい

よくあるのはWebComponentsで独自イベントを追加したときでしょうか。
例えば `swipe` イベントを追加した場合以下のようにすると追加できます。

```ts
interface SwipeAreaElement extends HTMLElement
{
	addEventListener( type: 'swipe', listener: ( event: SwipeAreaEvent ) => any, options?: boolean | AddEventListenerOptions ): void;
}

interface SwipeAreaData
{
	sx: number;
	sy: number;
	ex: number;
	ey: number;
}

class SwipeArea extends HTMLElement implements SwipeAreaElement
{
	...
}
```

class内では効いてないようですが、インスタンス化したやつに関してはちゃんと補完が効くようです。

