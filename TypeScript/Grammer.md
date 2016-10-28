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

