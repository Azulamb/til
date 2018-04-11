# ファイルの変更時間

Gitでバージョン管理されたファイルの変更時間は、残念ながらコミットされた時間ではなく、そういう制御は全くしていません。

自分で0から作ったリポジトリならそれでもいいですが、そうでない場合ファイルの更新時間からコミットを知る事はできません。

# サポートスクリプト

一応GitのサポートスクリプトとしてPerl製の `git-set-file-times` というものがあるようです。

https://qiita.com/mAster_rAdio/items/246fcab7984e50d7d66f

ただし上を見て貰えればわkるように、公式としてどこかに管理されてるわけでもないため、面倒なようです。
上の記事の作者が2つのスクリプトを混ぜた最新？版を公開しています。

https://gist.github.com/mAster-rAdio/642fff6acb79b7a587fb3bce7ee1c9ef

後、JSで実行する必要性に迫られたので、上を移植したのもあります。（未テスト・多分動いてる）

https://github.com/HirokiMiyaoka/git-set-file-times.js
