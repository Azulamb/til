# Shellで使える小技

## ランダムな文字列を生成


```
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1
```

8文字のランダムな文字列を生成します。以下のようにしてパスワードを生成して変数に入れておけます。

```
PASS=`cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1`

echo $PASS
```
