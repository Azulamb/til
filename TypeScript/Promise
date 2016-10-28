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
