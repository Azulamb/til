# そのJSが単体で実行されたのかそれともモジュールとして読み込まれたのか判定

単体て実行した時 `true` になるやつ

```
require.main === module
```

```
!module.parent
```

お好きな方どうぞ。

これにより、単体で実行された時にはコマンドとして機能し、そうじゃない時には底で使われている機能を提供するモジュールとして動作することができる。
