# 複数ユーザーで使いたいとき

Gitは以下の優先順位でユーザーを設定しているようです。

```
Local → Global → System
```

## Local

`.git/config` 内に以下のようにして書かれる。

```
[user]
	name = NAME
	email = EMAIL
```

## Global

今のユーザーに関するやつでLinuxとかだと `~/.gitconfig` とか `~/.config/git/config` に書かれるらしい。

## System

すべてのユーザーに関するやつでLinuxとかだと `/etc/gitconfig` に書かれるらしい。

## 使い分け

Systemは個人的に使ったこともないので多分普通だとユーザー情報は空のはず。

Globalは初期で設定すると思いますが、大体普通にGitリポジトリを作ったりするとこれの情報が使われます。

Localは自分で設定しないとないです。

ここで、複数アカウントを使うには、Globalを設定してLocalで個別にという運用になりがちですが、Globalを設定しないと、Localでの設定がない場合に警告が出てCommitができないので、会社マシンなどではGlobal設定せずにLocal一本で生きていくのもありかなと思います。

