# 準備事項など

## root宛のメールをユーザー宛に変更

```
vim /etc/aliases
```

```
# Person who should get root's mail
root:           USER
```

外部にメールを送りつつの場合は以下のように。

```
root:           \USER,mail@exsample.com
```

変更時にはちゃんと設定を反映します。

```
newaliases
```

