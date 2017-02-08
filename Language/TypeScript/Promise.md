# Promise

Promiseについて、まとめつつTypeScriptのみの要素でもメモしておきたい

## 大雑把なプロミスの使い方

### Promiseオブジェクトの作成

作れるのは以下3つ。

* 何でも利用可能で成功と失敗を返せるPromiseオブジェクト
* 成功したことにして引数で渡された値を返すPromiseオブジェクト
* 失敗したことにして引数で渡された値を返すPromiseオブジェクト

#### 何でも利用可能で成功と失敗を返せるPromiseオブジェクト

コールバック関数で動作するような非同期関数をPromiseにしたいときに使える。

```
function timer( sec )
{
	return new Promise( resolve, reject )
	{
		// コールバック関数を必要とする非同期関数の呼び出し
		setTimeout( function()
		{
			// 成功したらresolveを呼ぶ。
			resolve( { message: 'success' } );
			// 失敗したらrejectを呼ぶ
			//reject( { message: 'failure' } );
		}, sec * 1000 );
	}
}
```

#### 成功したことにして引数で渡された値を返すPromiseオブジェクト

```
function Success()
{
	return Promise.resolve( { message: 'success' } );
}
```

#### 失敗したことにして引数で渡された値を返すPromiseオブジェクト

```
function Success()
{
	return Promise.reject( { message: 'failure' } );
}
```

### Promiseオブジェクトに対して成功失敗の後の処理を書く

上で書いたような形でPromiseオブジェクトに対して、`then`と`catch`をメソッドチェインでつなげて書くことができる。

```
promiseObj.then( function( result )
{
	// 成功したとき
	// resultにはresolveやPromise.resolveで渡した値が入っている。
} ).catch( function( error )
{
	// 失敗したとき
	// errorにはrejectやPromise.reject、その他エラーや例外が渡した値が入っている。
} );
```

### 成功や失敗を連鎖させる

`then`や`catch`はそこに到達する前に実行した結果で飛ぶので、どんどん連鎖させたりすることができる。

例えば作ったすべてのPromise.allを使う時には、必ず成功させる必要があったりするので重宝する。

#### Promise.allにおける例

```
```

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

確かthen辺りのメソッドを持ってるオブジェクトは、PromiseLikeなオブジェクトなので、Promiseっぽく使える。

TypeScriptでの型もそのままPromiseLike。

## thenの引数の型

Promiseで成功したときに次のthenに処理が進みますが、これの型を指定できる。

```
function RetNum(): Promise<number> { ... }

Retnum().then( result )
{
	// result is number.
}
```

RetNumが返す型が、Promiseオブジェクトかつthenの引数に何を返すかを記述している（今回はnumber）。
これで、thenの引数の型を指定できるので、resultに対して補完が効くようになったりする。

これに関する注意が2点

* Promise生成をしている関数では、ちゃんと型があっているか調べてくれない
	* 上記だと、RetNumで例えば`return Promise.resolve('test');`とかしてもエラーにならない。
	* ここら辺は今後に期待？
* catchの型は指定できない
	* 後述

## catchの引数の型

thenに引き続き、失敗したときのcatchに渡される引数の型ですが、こちらは上と違い型の指定ができない。

理由としては、どうも他の失敗で投げられた例外なんかもこっちで引き取るので、型を決めることができないんだとか。
なので、catchの型についてはあきらめましょう。


## thenで型が変わる場合

以下のようなコードを考える。

```
function A(): Promise<number>
{
	return Promise.resolve( 10 );
}

function B(): Promise<string>
{
	return A().then( ( result ) =>
	{
		return Promise.resolve( result + '' );
	} );
}
```

この時 `B()` では `Promise` の結果として `string` を返すが、`A()` をreturnしているため、このままでは返り値の肩が `Promise<number>` になってしまい、エラーになる。

この場合、次のような型指定で `Promise<string>` を返すと明示できる。


```
function A(): Promise<number>
{
	return Promise.resolve( 10 );
}

function B(): Promise<string>
{
	return A().then( ( result ): Promise<string> =>
	{
		return Promise.resolve( result + '' );
	} );
}
```
