## TypeScript文法周りのメモ書き


## 変数周り

### 外部定義された変数の宣言(変数のアンビエント宣言)

これをしておけば大丈夫。

```
declare var val;
```

### 型定義の読み込み

```
/// <reference path="PATH_TO_TS.ts" />
```
