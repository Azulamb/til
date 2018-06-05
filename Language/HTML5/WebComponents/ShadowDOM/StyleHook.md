# スタイルフック

ShadowDOMの内と外では完全にスタイルが区切られ、双方への干渉は出来ません。
しかし、境界線上は若干特殊です。

```
<my-tag>
  <shadowRoot />
</my-tag>
```

ここで言う境界線は、`<my-tag>` です。
ShadowDOMはその親でスタイルを設定しますが、CSSカスタムプロパティを使うと、スタイルを一部内側に設定が可能です。

```
<my-tag style="--color:red;">
  <shadowRoot>
    <style>
      :root{ --main-color: var( --color, blue ); }
      div { color: var( --main-color ); }
    </style>
  </shadowRoot>
</my-tag>
```

こんな感じで、親に設定してあるCSSカスタムプロパティを参照できます。
（スタイルに影響を与えないというのは設定の話で、CSSカスタムプロパティはただの値定義なので、このようなことができる解釈。）

個人的には何度も定義されていた場合にはデフォルトの色を……と設定するのが嫌なので、`--color` を内部で使う `--main-color` に入れてそちらを使うことで無駄な処理を減らす手法を使っています。
