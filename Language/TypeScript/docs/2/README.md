# JavaScriptの基礎

TypeScriptはJavaScript＋その型に関する知識が必要なので、初めての方向けに大雑把に必要な知識をまとめていきます。

# JavaScriptの型

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

Why? ってなるような所も多いと思います。そこが結構生のJSを使っている時に辛いところです。
例えば配列であることを調べたいのに、`typeof` とかいう型を調べてくれそうなやつを使っても、結果は `object` になるわけです。だいぶ辛いです。

とりあえず、JavaScriptでは大まかには上に出ている `number`, `string`, `boolean`m `undefined`, `object`, `function` が基本的な型となります。

# 
