# JavaScriptの型

JavaScriptには見えないものの型が存在しています。

一応次のようにして型を調べることが出来ます。

```
console.log( typeof 1 );
```

この結果は文字列で `number` です。
このように文字列でその値や変数の型を調べることが出来ます。


# 基本となる型

JavaScriptの型を調べるため、いくつか見てみます。


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

## number

`number` は数値です。整数も浮動小数点数も一緒です。

一応整数の概念もあるので、整数にしたい場合は以下のようにします。

```
const num = 1.1;
console.log( num );
console.log( Math.floor( num ) );
```

ちなみに、無限は `Infinity` で、不正数値は Not a Numberから `NaN` が割り当てられています。
このように特殊な状態には特殊な名前がありますが、注意事項があります。

```
// 不正な数値は数値の仲間なので、typeof的にはnumber
console.log(typeof NaN);
// NaN同士を比較しても false なので、数値が正常かどうかの判定にNaNは使えない。
console.log( NaN === NaN );
```

このように、比較や検査には使えないと思ってください。

## string

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

## boolean

`boolean` は真偽値で、2つの値しかありません。
`true` と `false` です。

何かを比較した結果、最終的にこの真偽値になる他、フラグを立てる際にも使います。

## undefined

`undefined` は未定義の値です。確か宣言してない変数はそもそも扱ったらエラーになるのに何いってんだこいつ？っと思うでしょう。

例えば `undefined` は以下のような時に見られます。

```
let a;
console.log( a );
```

これを実行すると、`undefined` と表示されます。
このように宣言はされたものの中に値が入っていない時には `undefined` が使われます。

また、以下のように宣言されていない変数を使おうとすると存在すらしていないのでエラーになりますが

```
console.log( a ); // エラー
```

`typeof` を使えば存在しているかどうかをエラーなく確認できます。

```
console.log( typeof a );
```

この `undefined` のハマりポイントは、ズバリ代入できるということです。

```
let a = 1;
console.log( typeof a );
a = undefined;
console.log( typeof a );
```

結果は以下になります。

```
number
undefined
```

`undefined` だから存在すらしていない……というわけではなく、データ的には領域だけ存在するみたいなわけわからん状況が発生したりします。
初めはちょっと混乱するかもしれませんが、`undefined` を使いこなせば、いろいろ不思議な事もできるので、なんとなく覚えておいてください。

### nullについて

`undefined` と似たものに `null` があります。
`null` は `typeof` では `object` 扱いされる他にも明確な違いがあります。

それは `undefined` は未定義で空ですが、`null` は定義されていて意図的に空です。
これは次の `object` のところで大きな違いが現れます。

### object

`object` はJavaScriptでかなり自由自在にデータを入れることができるものです。
具体的には次のように使います。

```
const user = {
    id: 12345,
    name: 'ユーザー名',
    adult: true,
};
console.log( user );
console.log( user.name );
```

結果は以下です。

```
{ id: 12345, name: 'ユーザー名', adult: true }
ユーザー名
```

このように、任意のキー名（文字列）と値をセットで登録できます。
値には何でも入るので、オブジェクトの中にオブジェクトも入れれます。

## nullとundefinedの違い

さて、上でも出てきた `null` と `undefined` の明確な違いです。

```
const data = {
    name: null,
    job: undefined,
};
// データをすべて表示
console.log( data );
// jobを表示
console.log( data.job );
// 存在しないキー（age）を表示
console.log( data.age );
// データ構造を維持した文字列（JSON）に変換
console.log( JSON.stringify( data ) );
```

結果は以下のようになっています。

```
{ name: null, job: undefined }
undefined
undefined
{"name":null}
```

`undefined` を代入した `job` とそもそも `data` に存在すらしていない `age` はどちらも `undefined` という値なので、存在しているかどうか判定することは出来ません。

一見役立たずに見える `undefined` ですが、このデータをJSONという文字列データに変換すると、`null` は残り、`undefined` を指定した 'job' は項目が見当たりません。

JSONはJavaScriptの基本的なデータ構造を文字列化したもので、`number`、'string'、'boolean'、'object' が使えます。
JSONはJavaScriptで簡単に使える他、その他言語でも比較的簡単に使えるようライブラリが充実しており、特にWeb周りでよく使われる一般的なフォーマットです。

JSONでは存在しない値のキーを出力する必要はないので消す一方、データはないが項目は存在する `null` に関しては消さずに残すようになっています。

### 補足

JavaScriptはクラスベースのオブジェクト指向型言語ではなく、プロトタイプベースのオブジェクト指向型言語です。

クラスベースの場合、オブジェクトには明確な型がありますが、柔軟性はなく、それに柔軟性を持たせるために継承を使います。

一方プロトタイプベースの場合は、汎用的なオブジェクトに対し、任意の値、任意のメソッドを生やすことで柔軟性をもたせています。

配列は、例えばlengthがあるとか、0から増えるキーに対して値が入っているとか、配列操作用のメソッドがあるみたいな条件を満たしたオブジェクトを配列として扱っているようなイメージで動作します。
そのため、通常の方法ではある変数が変数かオブジェクトかの判断をするのはかなり難易度が高いです。

ただし、相当古いブラウザを対象としない限り、`Array.isArray( 変数 )` を使うことで配列かどうか判定することが出来ます。

このような特殊な型の判定はTypeScriptでは基本必要ないのですが、JavaScriptとの境界線やユーザーや外部からの入力の境界線付近で必要となります。

## function

# 型が曖昧な場合に起こりうるバグ

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

