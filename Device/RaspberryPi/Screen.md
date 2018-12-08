# スクリーン周り

Raspberry Pi用3.5インチ TFTタッチスクリーンディスプレイ( https://www.switch-science.com/catalog/3784/ )は電源を別から引いてHDMIを挿すだけでディスプレイが使えるため初期セットアップなどに非常に便利です。
しかしこれの解像度は480x320に対し、かなり解像度が高い出力となっているため、文字が潰れて読めません。

そこで以下のようにすると解像度の設定が可能です。

`/boot/config.txt`

```
framebuffer_width=480
framebuffer_height=320
hdmi_group=2
hdmi_mode=87
hdmi_cvt=480 320 60 1 0 0 0
```

https://corgi-lab.com/raspberrypi/raspberrypi3-hdmi/

これでいい感じに画面を見れます。

# SPI

## SPIの有効化

