何を書いていくか。

とりあえず基本的な文法や特徴、後TypeScriptを使うために型の基礎知識は必須。

分量多くなるしある程度溜まったらファイルに分離していく。

# 目次

* [変数とスコープ](./Variable.md)
    * まとめ：変数宣言に使う優先度は `const` >>> `let` >>>>>>>>越えられない壁>>>>>>>> `var`
* JavaScriptの型
* ifとかforのような基本的な構文
* 関数とイベント
* class

# JavaScriptの基礎

TypeScriptはJavaScript＋その型に関する知識が必要なので、初めての方向けに大雑把に必要な知識をまとめていきます。

# JavaScriptの型

## 基本となる型

JavaScriptには見えないものの型が存在しています。
その型は大体以下になります。


```
// 数値
console.log( typeof 1 );

// 文字列
console.log( typeof '' );

// 真偽値
console.log( typeof true );

// undefined
console.log( typeof undefined );

// null
console.log( typeof null );

// 配列
console.log( typeof [] );

// オブジェクト
console.log( typeof {} );

// 関数
console.log( typeof function(){} );

// クラス
console.log( typeof class{} );
```

結果は以下です。

```
number    // 数値
string    // 文字列
boolean   // 真偽値
undefined // undefined
object    // null
object    // 配列
object    // オブジェクト
function  // 関数
function  // クラス
```

Why? ってなるような所も多いと思います。そこが生のJSを使っている時に辛いところです。
例えば配列であることを調べたいのに、`typeof` とかいう型を調べてくれそうなやつを使っても、結果は `object` になるわけです。だいぶ辛いです。

とりあえず、JavaScriptでは大まかには上に出ている `number`, `string`, `boolean`, `undefined`, `object`, `function` が基本的な型となります。

### number

`number` は数値です。整数も浮動小数点も一緒です。

一応整数の概念もあるので、整数にしたい場合は以下のようにします。

```
const num = 1.1;
console.log( num );
console.log( Math.floor( num ) );
```

ちなみに、無限は `Infinity` で、不正数値は Not a Numberから `NaN` が割り当てられています。

```
// 不正な数値は数値の仲間なので、typeof的にはnumber
console.log(typeof NaN);
// NaN同士を比較しても false なので、数値が正常かどうかの判定にNaNは使えない。
console.log( NaN === NaN );
```

### string

`string` は文字列です。
加工するためのメソッドが用意されている他、`length` で文字数も取得できます。


```
// 3文字の長さなので3
console.log( 'aaa'.length );
// 日本語は1文字1換算なので1
console.log( 'あ'.length );
// こっちは2！
console.log( 'あい'.length );
// 絵文字は……2？
console.log( '😀'.length );
```

文字列に関しては基本Unicodeですが、サロゲートペアと呼ばれるものが含まれた特殊な文字に関しては正確に文字数を `length` で取得することは出来ません。
絵文字の他特殊な漢字も含まれます。
文字数取得できるのは嘘ですごめんなさい。

最近は絵文字や特殊な漢字なども使われることが増えてきたので、こういった問題があることを把握しておきましょう。

### boolean

### undefined

#### nullについて

### object

#### 補足

JavaScriptはクラスベースのオブジェクト指向型言語ではなく、プロトタイプベースのオブジェクト指向型言語です。

クラスベースの場合、オブジェクトには明確な型がありますが、柔軟性はなく、それに柔軟性を持たせるために継承を使います。

一方プロトタイプベースの場合は、汎用的なオブジェクトに対し、任意の値、任意のメソッドを生やすことで柔軟性をもたせています。

配列は、例えばlengthがあるとか、0から増えるキーに対して値が入っているとか、配列操作用のメソッドがあるみたいな条件を満たしたオブジェクトを配列として扱っているようなイメージで動作します。
そのため、通常の方法ではある変数が変数かオブジェクトかの判断をするのはかなり難易度が高いです。

ただし、相当古いブラウザを対象としない限り、`Array.isArray( 変数 )` を使うことで配列かどうか判定することが出来ます。

このような特殊な型の判定はTypeScriptでは基本必要ないのですが、JavaScriptとの境界線やユーザーや外部からの入力の境界線付近で必要となります。

### function

## 型が曖昧な場合に起こりうるバグ

上のような型のバグはまだわかりやすいのですが、例えば `parseInt` にまつわるバグはかなり根深かったりします。

`parseInt( 文字列, 進数の指定 )` は与えられた文字列を第二引数の進数で解釈して返す挙動なので、以下のような挙動になります。

```
console.log( parseInt( '1' ) );
console.log( parseInt( '0.0000009' ) );
console.log( parseInt( 0.0000009 ) );
```

結果は以下です。

```
1
0
9
```

9……？なぜ？

文字列の1を整数に直せば1です。
文字列の0.0000009を整数に直せば小数点以下を無視して0です。

では、なぜ数値の0.0000009を整数にすると9になるのか。

その答えは以下です。

```
console.log( 0.0000009.toString() );
console.log( parseInt( 0.0000009.toString() ) );
console.log( parseInt( 0.0000009 ) );
```

結果は以下です。

```
9e-7
9
9
```

`paraseInt` は第一引数に与えられた変数が文字列であることを前提としています。
数値を与えた場合、文字列に変換してから処理が行われます。

結果`、0.0000009` を文字列にした場合 `9e-7` となり、この文字列を整数に変換する場合、9までは認識して、次の文字が数値ではないのでそこで変換を終了し、9という結果を返します。

このように、JavaScriptは見えないからといって型を無視するわけにはいきません。
それっぽく動いても動かないケースというものが存在します。



