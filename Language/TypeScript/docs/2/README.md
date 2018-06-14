何を書いていくか。

とりあえず基本的な文法や特徴、後TypeScriptを使うために型の基礎知識は必須。

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

# スコープ

JavaScriptの変数の宣言は以下3種類です。

* `var`
    * 再代入可能。関数スコープ。
* `let`
    * 再代入可能。ブロックスコープ。
* `const`
    * 再代入不可能。ブロックスコープ。

## var

元々のJavaScriptにある唯一の変数を宣言するキーワードでした。

よくある変数にあるように値を再代入できます。

```
// 数値を入れる変数
var num = 0;
// 別に後から文字列を代入しても良い
num = 'test';
```

ただ、このスコープがかなり特殊です。

まずは普通のパターン。

```
var global = 1;

function func() {
    console.log( 'func:', global );
}

console.log( global );
++global;
func();
```

結果は以下です。

```
1
func: 2
```

次に宣言されていない変数を出力してみます。

```
console.log( i );
```

Node.jsだと次のような結果になります。

```
(function (exports, require, module, __filename, __dirname) { console.log( i );
                                                                           ^

ReferenceError: i is not defined
```

JavaScriptは完全に宣言すらされていないものを使おうとすると、エラーになります。

では次のようなケースはどうでしょう？

```
console.log( i );

for ( var i = 0 ; i < 5 ; ++i ) { console.log( i ); }
```

結果は以下です。

```
undefined
0
1
2
3
4
```

何故かエラーになりません。

JavaScriptの場合、`var` は関数スコープで、宣言した場合関数の一番始めで宣言された状態になります。なので上のコードは以下と等価です。

```
var i;

console.log( i );

for ( i = 0 ; i < 5 ; ++i ) { console.log( i ); }
```

iという変数はあるが、中身には何も入れていないので、undefinedという結果をまず出力し、後はループ文では開始時に0を代入されたのでそこから演算をしています。

## letとconst

一方最近のJavaScriptには新しい変数の宣言として `let` と `const` が追加されました。

```
console.log( i );

for ( let i = 0 ; i < 5 ; ++i ) { console.log( i ); }
```

こちらのコードですが、普通にエラーになります。
`let` と `const` はブロックがスコープなので、`i` はforループの中でのみ有効です。

このように変数のスコープが分かりやすくなっているので、基本的には `let` と `const` を使うようにしましょう。

## const

では、constは何のためにあるのか？
一応効果では再代入不可能となっています。

```
const pi = 3.14;
pi = 3;
```

この場合次のようなエラーが発生します。

```
pi = 3;
   ^

TypeError: Assignment to constant variable.
```

このように初回以外の代入はすべてエラーとなるため、定数などの宣言に使うことが推奨されます。

……っと言いたいところですが、こちら、基本は `const` を使うようにしましょう。

理由としては、再代入により型が変わったり使い方が変わることで、バグの温床になりかねないからです。
逆に言えば、`const` で宣言された変数は今後変な値を代入されることはないため、デバッグの助けになります。

そのため、基本的に変数はすべて `const` で宣言し、どうしてもループで使いたいなどの時に限り `let` を使うようにします。

とりあえず `let` と `const` があれば必ず `var` を使わなければならない状況というものは基本ないので、`var` は使わないようにしましょう。
4年以上使ってますが、一度も `var` じゃないと無理なコードを書いたことはありません。

何度も書きますが、基本は `const` のみ使い、どうしても再代入必要な変数だけ `let` にして、本当に `var` でなければ動かないコードの時のみ `var` を使うようにしましょう。

