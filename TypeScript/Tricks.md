# TypeScriptのエラー回避策


TypeScriptは非常に使い勝手が良いのですが、型で縛っている分普通のJavaScriptで許容されるさまざまな操作ができません。
ここでは主に型のせいでエラーになるが、例外はプログラマーが把握し対策できるので、何とかしたいときの小技をまとめています。


## 基本

anyは最強。

```
const obj: { name: string } = { name: 'test' };
obj.id = 0; // Error
(<any>obj).id = 0; // OK
```

`obj`をany型にしてしまえば、型に存在しないidを付加することも可能。

## 一時的にnullを追加

nullを許容しないNon-nullable typesはnullやundefinedによるエラーを回避できますが、例えばオブジェクトの一部をnullにすることはできません。

```
const obj: { name: string } = {}; // Error
const obj: { name: string } = { name: '' }; // OK
```

この場合、キー名の最後に?をつけると、null/undefinedを許容します。

```
const obj: { name?: string } = {}; // OK?
const name: string = obj.name; // Error
```

しかし、これを使ってしまうと他の部分でnullチェックをしないといけないなどの影響が出てきます。

(1行目は良いが、2行目は`name`がstring型の変数なのに、`obj.name`がundefinedやnullの可能性があるので、チェックしないとエラーになる。)

nullを入らないことを許容しつつも、最初の初期化だけnullを入れる場合は次のようにします。

```
const obj: { name: string } = { name: <any>null }; // OK
const name: string = obj.name; // No error!!!
obj.name = "hello";
```

これを使う場合はちゃんとプログラマーがnullが入った状態で他の処理にデータが渡らないことを保証してください。

(2行目はNon-nullable types時でもエラーにならない。あくまで`obj.name`はnullやundefinedではないstring型という認識なので。)

## 任意の値を追加可能なオブジェクト

オブジェクトの型を決め打ちすると便利ですが、値を追加するたびにany型にするのは不便です。

```
const obj: { name: string } = { name: '' };
obj.address = 'Japan'; // Error
```

`obj`をanyにすれば良いですが、毎回は面倒です。
そこで、少し応用が効きやすい型に変更します。

```
const obj: { name: string, [ key: string ]: string } = { name: '' };
obj[ 'address' ] = 'Japan'; // OK
```

これでキーと値が文字列の値を追加可能なオブジェクトができました。

また以下のようにすると、値をanyにもできます。

```
const obj: { name: string, [ key: string ]: any } = { name: '' };
obj[ 'id' ] = 0; // OK
```
