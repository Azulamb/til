## TypeScript文法周りのメモ書き


## 変数周り

### 外部定義された変数の宣言(変数のアンビエント宣言)

これをしておけば大丈夫。

```
declare var val;
```

## 型周り

### 引数の型を任意にする

変数名の後に?をつける。

```
function ( name?: string ) {}
```

### 可変長引数

可変長引数かつその型が全て、決まっているような場合以下のように記述可能

```
function CSVLine( ...items: string[] ): string
{
	return items.join( ',' );
}

// aa,bb,cc
console.log( CSVLine( 'aa', 'bb', 'cc' ) );
```

### 関数の型

```
( 引数 ) => 返り値の型
```

返り値の型がない場合 `void` を指定する。

#### 例

```
() => void
( strnum: string ) => number
( name: string, value?: string ) => void
```

### 関数の型を型定義

例えばコールバック関数などを受け取るときに使います。

```
interface 型名{(引数) :返り値};
```

#### 例

```
interface CallbackFunction{ ( argv :number ) :string };

function Sample( cb: CallbackFunction ) {
	console.log( cb( 1 ) );
}

Sample( ( num: number ) => { return 'test' + num; } );
```
### classに定数を持たせる

やりたいことは以下のような感じ。

```
class A{
	enum Color{ Red, Green, Blue } // Error
}

//// other file.

console.log( A.Color.Red );
```

こんな感じのを実現するのは以下。

```
enum AColor{ Red, Green, Blue }
class A{
	static Color = AColor;
}

//// other file.

console.log( A.Color.Red ); // OK
```

### 型定義の読み込み

```
/// <reference path="PATH_TO_TS.ts" />
```

## 後で

https://blogs.msdn.microsoft.com/typescript/2016/12/07/announcing-typescript-2-1/

TypeScript 2.1の内容。結構便利なのがあるっぽいのでここに入れたい。
