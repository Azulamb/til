# Promise

Promiseについて、まとめつつTypeScriptのみの要素でもメモしておきたい

## Promiseの型

Promiseオブジェクトの型は以下のようになる

```
Promise<{}>
```

Promise.allで配列を渡す場合などは、次のようにして配列を定義できる。

```
const p: Promise<{}>[] = [];
```

## PromiseLike

確かthen辺りのメソッドを持ってるオブジェクトは、PromiseLikeなオブジェクトなので、Promiseっぽく使えます

TypeScriptでの型もそのままPromiseLikeです。

## thenの引数の型

Promiseで成功したときに次のthenに処理が進みますが、これの型を指定できます。

```
function RetNum(): Promise<number> { ... }

Retnum().then( result )
{
  // result is number.
}
```

これで、thenの引数の型を指定できるので、resultに対して補完が効くようになったりします。

これに関する注意が2点

* Promise生成をしている関数では、ちゃんと型があっているか調べてくれない
    * 上記だと、RetNumで例えば`return Promise.resolve('test');`とかしてもエラーにならない。
    * ここら辺は今後に期待？
* catchの型は指定できない
    * 後述

## catchの引数の型

thenに引き続き、失敗したときのcatchに渡される引数の型ですが、こちらは上と違い型の指定ができません。

理由としては、どうも他の失敗で投げられた例外なんかもこっちで引き取るので、型を決めることができないんだとか。
なので、catchの型についてはあきらめましょう。
