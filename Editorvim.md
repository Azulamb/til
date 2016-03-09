基本操作、設定、よく使うコマンドとかメモっておく。

## 十字キー有効など使いやすくする設定

純vi挙動だと最近のエディタに慣らされた人間は辛いことがあるのじゃ。

とりあえず下の設定を~/.vimrcとかに書いとけば良い。

```
set number
set title
set ambiwidth=double
set tabstop=4
set expandtab
set shiftwidth=4
set smartindent
set nrformats-=octal
set virtualedit=block
set whichwrap=b,s,[,],<,>
set backspace=indent,eol,start
```

## よく使う基本操作

