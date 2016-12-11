
    Exception: javax.net.ssl.SSLException: java.lang.RuntimeException: Unexpected error: java.security.InvalidAlgorithmParameterException: the trustAnchors parameter must be non-empty

こんなエラーが出た時は次のようなコマンドを実行してみる。

    sudo update-ca-certificates -f
