# Frontend Rules

Bu belge frontend gelistirme surecinde baglayici calisma kurallaridir.
Frontend tarafinda her degisiklikten once bu dosya kontrol edilir.

## Altin Kurallar

1. Component boyutu

Hicbir component 300 satiri gecmez.
Bir component bu sinira yaklasiyorsa alt componentlere, hook'lara veya yardimci dosyalara bolunur.

2. Branch disiplini

`main` branch'inde dogrudan calisilmaz.
Her feature, fix veya deneme icin once yeni bir branch acilir.
Frontend gelistirmeleri yalnizca acilan calisma branch'inde yapilir.

3. Tasarim butunlugu

Mevcut tasarim dili korunur.
Var olan renk paleti, hiyerarsi, spacing, radius, shadow ve genel UI karakteri bozulmaz.
Tutarsiz tema kaymalari, anlamsiz renk degisiklikleri veya mevcut tasarimla uyumsuz gorunumler eklenmez.

## Uygulama Notu

Frontend tarafinda yeni gelistirme yaparken once bu kurallara uyum kontrol edilir, sonra kod yazilir.
