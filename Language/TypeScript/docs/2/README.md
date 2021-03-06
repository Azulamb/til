何を書いていくか。

とりあえず基本的な文法や特徴、後TypeScriptを使うために型の基礎知識は必須。

分量多くなるしある程度溜まったらファイルに分離していく。

# JavaScriptの基礎

TypeScriptはJavaScript＋型に関する知識が必要なので、初めての方向けに大雑把に必要な知識をまとめていきます。

JavaScriptについて知識がある人は読まなくても良いですが、「え？変数宣言って`var`以外にあるの？」とか「え？classって使えるの？」という人は読んでおいてください。
（ES6以降のJavaScriptはそれはもう見違えるような言語になっています。）

# 目次

* JavaScriptの概要（このページ）
* [JavaScriptの実行方法](./Execute.md)
* [JavaScriptの基本的な構文](./Syntax.md)
* [変数とスコープ](./Variable.md)
    * まとめ：変数宣言に使う優先度は `const` >>> `let` >>>>>>>>越えられない壁>>>>>>>> `var`
* [JavaScriptの型](./Types.md)
* 関数とイベント
* class

# JavaScriptの概要

JavaScriptは元々ブラウザ上で動く言語として開発されました。
一時期は禁止傾向があったり独自拡張やAJAXによるリッチ化などなどもありましたが、HTML5がでた付近から各ブラウザで新しいJavaScriptの中核部分を共通仕様（ECMAScript）で作っていこうという流れになってきています。

また中核部分を分離したことで、Node.jsなどのブラウザ以外で動かす選択肢も出てきました。
そのため、これからのJavaScriptは基本的に以下のどちらに属するかを意識して学ぶ必要があります。

* JavaScript本体の仕様であるECMAScript
* JavaScriptを動かす環境に応じた差分
    * 通常のブラウザ内で動くWebページ
    * ServiceWorkerなどWebページと連携はするがWebページの外側かつブラウザの内側
    * Node.jsなどブラウザ外（サーバーサイド、デスクトップなど）
    * など

今回のTypeScriptは主にECMAScript中心で書いていきます。
後半はサーバーサイドやブラウザで動かす例も出てくると思いますが、それ以外はNode.jsで単一ファイルを動かすことを前提とします。（複数ファイルに別れなければブラウザで動かしても結果は変わらないので、ブラウザで実行しても良い。）


