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

# WaveShare 240x240, 1.3inch IPS LCD display HAT for Raspberry Pi with ST7789VW

https://github.com/juj/fbcp-ili9341

```
git clone https://github.com/juj/fbcp-ili9341.git
cd fbcp-ili9341/
mkdir build
cd build/
cmake -DWAVESHARE_ST7789VW_HAT=ON -DSPI_BUS_CLOCK_DIVISOR=6 ..
make -j
ls
```

生成物の `fbcp-ili9341` を確認します。

```
CMakeCache.txt  CMakeFiles  cmake_install.cmake  fbcp-ili9341  Makefile
```

ファイル生成を確認できたら `/etc/rc.local` に設定を追加します。

```
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

/PATH/fbcp-ili9341/build/fbcp-ili9341&
exit 0
```

これで再起動するといい感じに。
