## TypeScript文法周りのメモ書き


## 変数周り

### 外部定義された変数の宣言(変数のアンビエント宣言)

これをしておけば大丈夫。

```
declare var val;
```

## 型周り

### 引数の型を院胃にする

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
( strnum: string ) => int
( name: string, value?: string ) => void
```

### 型定義の読み込み

```
/// <reference path="PATH_TO_TS.ts" />
```

## 後で

https://blogs.msdn.microsoft.com/typescript/2016/12/07/announcing-typescript-2-1/

TypeScript 2.1の内容。結構便利なのがあるっぽいのでここに入れたい。
