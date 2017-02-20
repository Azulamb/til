# Go言語の型指定

## 配列

配列の型は `[]配列にする値の型` で、文字列なら `[]string` になる。

初期化などは以下のように行う。

```
strarr := []string{}
```

## マップ

よく連想配列やハッシュと呼ばれるものはGoではマップと呼ぶ。

キーと値をセットで格納できる。

`map[キーの型]値の型` が型で、キーが文字列、値がintの場合 `map[string]int` になる。

初期化などは以下のように行う。

```
strmap := map[string]int{}
```

## 構造体

Goでの構造体は以下のように定義する

```
type StructName struct{
    key   string
    value int
}
```

例えば上の構造体なら、以下のように初期化する。

```
data := StructName{
    key: "test",
    value : 0,
}
```

## 関数の型

関数の型は `(引数の型) 返り値の型` となり、返り値が複数の場合は()で囲むので、例えば関数の型を定義して使いまわす場合、次のようになる。

```
type FuncType func(args []string) (int, bool)
```
