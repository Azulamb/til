# Docker周り色々

頑張ってdocxekrをインストールする。

## イメージのダウンロード

```
docker pull IMAGE
```

## イメージの一覧

```
docker images
```

## イメージに名前をつけて実行

```
docker run -i -t --name NAME IMAGE /bin/bash
```

## 今動いてるコンテナの一覧

```
docker ps
```

## 最後に実行したコンテナ情報の表示及びIDだけ表示

```
docker ps -l
docker ps -l -q
```
