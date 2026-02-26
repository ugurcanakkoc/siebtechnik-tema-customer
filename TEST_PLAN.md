# UVP Pano Montajı - Test ve Doğrulama Planı

Bu döküman, projenin son kullanıcıya teslim edilmeden önce yapılması gereken kritik testleri ve doğrulama adımlarını içermektedir.

## 1. Arayüz ve Navigasyon Testleri
- [ ] **Custom Cursor**: İmleç hareketinin 1:1 hızda olduğu ve herhangi bir gecikme (lag) barındırmadığı doğrulanmalı.
- [ ] **Header**: Müşteri ve UVP logolarının net bir şekilde görüldüğü, linklerin doğru çalıştığı kontrol edilmeli.
- [ ] **Dil Değişimi**: EN/DE butonlarına basıldığında tüm metinlerin (başlıklar, açıklamalar, butonlar) anında değiştiği doğrulanmalı.
- [ ] **Responsive Tasarım**: Desktop, Tablet ve Mobil cihazlarda grid yapısının bozulmadığı ve içeriklerin okunabilir olduğu kontrol edilmeli.

## 2. Galeri ve Medya Testleri
- [ ] **Lightbox**: Proje kartına tıklandığında resim galerisinin açıldığı doğrulanmalı.
- [ ] **Kapatma Butonu (Lightbox)**: Galeri açıldığında sağ üstteki **X** butonunun görünür ve tıklanabilir olduğu, galeriyi kapattığı doğrulanmalı.
- [ ] **3D Model Butonu**: Galeri içerisinde "3D MODEL" butonunun sadece modeli olan projelerde gözüktüğü kontrol edilmeli.

## 3. 3D Viewer (Dijital İkiz) Testleri
- [ ] **Model Yükleme**: 3D MODEL butonuna basıldığında portalın açıldığı ve modelin başarıyla yüklendiği doğrulanmalı.
- [ ] **Kamera Kontrolleri**: Alt taraftaki yön butonlarının ve "Reset" butonunun modeli doğru hareket ettirdiği kontrol edilmeli.
- [ ] **Kapatma Butonu (3D)**: Sağ üstteki **X** butonunun ve **ESC** tuşunun 3D ekranını hatasız kapattığı doğrulanmalı.
- [ ] **Body Scroll Lock**: 3D viewer açıkken ana sayfanın arka planda kaymadığı (scroll) kontrol edilmeli.

## 4. Teknik ve Performans Testleri
- [ ] **SEO**: Başlık (Title) ve Meta açıklamalarının "Dijital İkiz" ve "AI" odaklı olduğu doğrulanmalı.
- [ ] **Bağlantılar**: Footer ve Header üzerindeki tüm harici linklerin yeni sekmede açıldığı kontrol edilmeli.
- [ ] **Gereksiz Veriler**: Sitede "ONLINE", "CPU TEMP", "LOAD %" gibi sahte teknik verilerin kalmadığı, tamamen profesyonel içerik olduğu doğrulanmalı.
