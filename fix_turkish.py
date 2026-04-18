import os

replacements = [
    # Olustur grubu
    ("olusturulamadi", "oluşturulamadı"),
    ("olusturulacak", "oluşturulacak"),
    ("olusturulan", "oluşturulan"),
    ("olusturabilir", "oluşturabilir"),
    ("olusturma", "oluşturma"),
    ("olusturuldu", "oluşturuldu"),
    ("olusturul", "oluşturul"),
    ("olusturan", "oluşturan"),
    ("Olusturulamadi", "Oluşturulamadı"),
    ("Olusturma", "Oluşturma"),
    ("Olusturul", "Oluşturul"),
    ("Olustur", "Oluştur"),
    ("olustur", "oluştur"),

    # Gonderi / Gonder grubu
    ("gonderilemiyor", "gönderilemiyor"),
    ("gonderilemedi", "gönderilemedi"),
    ("gonderiliyor", "gönderiliyor"),
    ("gonderildi", "gönderildi"),
    ("gonderilebilir", "gönderilebilir"),
    ("Gonderilebilir", "Gönderilebilir"),
    ("Gonderildi", "Gönderildi"),
    ("Gonderiliyor", "Gönderiliyor"),
    ("Gonderi", "Gönderi"),
    ("gonderi", "gönderi"),
    ("Gonderemedi", "Gönderilemedi"),
    ("Gonderiminiz", "Gönderiminiz"),
    ("gonderemedi", "gönderilemedi"),
    ("Gonder", "Gönder"),
    ("gonder", "gönder"),

    # Yayinla
    ("yayinlaniyor", "yayınlanıyor"),
    ("yayinlandi", "yayınlandı"),
    ("Yayinlaniyor", "Yayınlanıyor"),
    ("Yayinlandi", "Yayınlandı"),
    ("Yayinla", "Yayınla"),
    ("yayinla", "yayınla"),

    # Aciklama / Acik
    ("aciklamasini", "açıklamasını"),
    ("aciklamasi", "açıklaması"),
    ("Aciklama", "Açıklama"),
    ("aciklama", "açıklama"),
    ("Acikla", "Açıkla"),
    ("acikla", "açıkla"),
    ("Acik", "Açık"),
    ("acik", "açık"),

    # Cikis
    ("cikinca", "çıkınca"),
    ("cikip", "çıkıp"),
    ("Cikis", "Çıkış"),
    ("cikis", "çıkış"),

    # Giris
    ("Girisim", "Girişim"),
    ("girisim", "girişim"),
    ("Girisler", "Girişler"),
    ("girisler", "girişler"),
    ("Giris", "Giriş"),
    ("giris", "giriş"),

    # Sifre
    ("sifreleme", "şifreleme"),
    ("Sifreleme", "Şifreleme"),
    ("sifrele", "şifrele"),
    ("Sifrele", "Şifrele"),
    ("Sifre", "Şifre"),
    ("sifre", "şifre"),

    # Universite
    ("Universitemiz", "Üniversitemiz"),
    ("universitemiz", "üniversitemiz"),
    ("Universiteyi", "Üniversiteyi"),
    ("universiteyi", "üniversiteyi"),
    ("Universitenizi", "Üniversitenizi"),
    ("universitenizi", "üniversitenizi"),
    ("Universitenin", "Üniversitenin"),
    ("universitenin", "üniversitenin"),
    ("Universite", "Üniversite"),
    ("universite", "üniversite"),

    # Kesfet
    ("Kesfet", "Keşfet"),
    ("kesfet", "keşfet"),

    # Begeni
    ("begenebilirsin", "beğenebilirsin"),
    ("Begenebilirsin", "Beğenebilirsin"),
    ("begenebileceg", "beğenebilecek"),
    ("Begeniler", "Beğeniler"),
    ("begeniler", "beğeniler"),
    ("begenildi", "beğenildi"),
    ("Begenildi", "Beğenildi"),
    ("Begeni", "Beğeni"),
    ("begeni", "beğeni"),

    # Topluluk
    ("toplulugunu", "topluluğunu"),
    ("Toplulugunu", "Topluluğunu"),
    ("toplulugunuzu", "topluluğunuzu"),
    ("Toplulugunuzu", "Topluluğunuzu"),
    ("toplulugunun", "topluluğunun"),
    ("Toplulugunun", "Topluluğunun"),
    ("toplulugun", "topluluğun"),
    ("Toplulugun", "Topluluğun"),
    ("topluluga", "topluluğa"),
    ("Topluluga", "Topluluğa"),
    ("toplulugu", "topluluğu"),
    ("Toplulugu", "Topluluğu"),

    # Kayit
    ("Kayitlarda", "Kayıtlarda"),
    ("kayitlarda", "kayıtlarda"),
    ("Kayitlar", "Kayıtlar"),
    ("kayitlar", "kayıtlar"),
    ("Kayitli", "Kayıtlı"),
    ("kayitli", "kayıtlı"),
    ("Kayit", "Kayıt"),
    ("kayit", "kayıt"),

    # Takipci
    ("takipcilik", "takipçilik"),
    ("Takipcilik", "Takipçilik"),
    ("Takipciler", "Takipçiler"),
    ("takipciler", "takipçiler"),
    ("Takipci", "Takipçi"),
    ("takipci", "takipçi"),

    # Ogrenci
    ("Ogrenciler", "Öğrenciler"),
    ("ogrenciler", "öğrenciler"),
    ("Ogrenci", "Öğrenci"),
    ("ogrenci", "öğrenci"),

    # Icerik
    ("Icerikler", "İçerikler"),
    ("icerikler", "içerikler"),
    ("Icerik", "İçerik"),
    ("icerik", "içerik"),

    # Yukle
    ("yuklenirken", "yüklenirken"),
    ("Yuklenirken", "Yüklenirken"),
    ("yukleniyor", "yükleniyor"),
    ("Yukleniyor", "Yükleniyor"),
    ("yuklenemedi", "yüklenemedi"),
    ("Yuklenemedi", "Yüklenemedi"),
    ("yuklendi", "yüklendi"),
    ("Yuklendi", "Yüklendi"),
    ("yuklenemiyor", "yüklenemiyor"),
    ("Yukle", "Yükle"),
    ("yukle", "yükle"),

    # Goster
    ("Gosteriyor", "Gösteriyor"),
    ("gosteriyor", "gösteriyor"),
    ("Gosteriliyor", "Gösteriliyor"),
    ("gosteriliyor", "gösteriliyor"),
    ("Goster", "Göster"),
    ("goster", "göster"),

    # Duzenle / Duzelt
    ("Duzenleniyor", "Düzenleniyor"),
    ("duzenleniyor", "düzenleniyor"),
    ("Duzenle", "Düzenle"),
    ("duzenle", "düzenle"),
    ("Duzelt", "Düzelt"),
    ("duzelt", "düzelt"),

    # Guncelle
    ("guncelleniyor", "güncelleniyor"),
    ("Guncelleniyor", "Güncelleniyor"),
    ("Guncellenemedi", "Güncellenemedi"),
    ("guncellenemedi", "güncellenemedi"),
    ("Guncelle", "Güncelle"),
    ("guncelle", "güncelle"),

    # Kullanici
    ("kullanicilarini", "kullanıcılarını"),
    ("Kullanicilarini", "Kullanıcılarını"),
    ("kullanicilarin", "kullanıcıların"),
    ("kullanicilari", "kullanıcıları"),
    ("kullanicilar", "kullanıcılar"),
    ("Kullanicilar", "Kullanıcılar"),
    ("kullanicinin", "kullanıcının"),
    ("kullaniciyi", "kullanıcıyı"),
    ("Kullanici", "Kullanıcı"),
    ("kullanici", "kullanıcı"),

    # Paylas
    ("paylasimlar", "paylaşımlar"),
    ("Paylasimlar", "Paylaşımlar"),
    ("paylasimi", "paylaşımı"),
    ("Paylasimi", "Paylaşımı"),
    ("Paylasim", "Paylaşım"),
    ("paylasim", "paylaşım"),
    ("Paylasimlari", "Paylaşımları"),
    ("paylasimlari", "paylaşımları"),
    ("Paylasildi", "Paylaşıldı"),
    ("paylasildi", "paylaşıldı"),
    ("Paylasilamadi", "Paylaşılamadı"),
    ("paylasilamadi", "paylaşılamadı"),
    ("Paylas", "Paylaş"),
    ("paylas", "paylaş"),

    # Kampus
    ("Kampus", "Kampüs"),
    ("kampus", "kampüs"),

    # Bolum
    ("Bolumler", "Bölümler"),
    ("bolumler", "bölümler"),
    ("Bolumun", "Bölümün"),
    ("bolumun", "bölümün"),
    ("Bolum", "Bölüm"),
    ("bolum", "bölüm"),

    # Arkadas
    ("Arkadaslik", "Arkadaşlık"),
    ("arkadaslik", "arkadaşlık"),
    ("Arkadaslar", "Arkadaşlar"),
    ("arkadaslar", "arkadaşlar"),
    ("Arkadas", "Arkadaş"),
    ("arkadas", "arkadaş"),

    # Sikayet
    ("Sikayet", "Şikayet"),
    ("sikayet", "şikayet"),

    # Lutfen
    ("Lutfen", "Lütfen"),
    ("lutfen", "lütfen"),

    # Asagi
    ("Asagi", "Aşağı"),
    ("asagi", "aşağı"),

    # Basari
    ("Basarisiz", "Başarısız"),
    ("basarisiz", "başarısız"),
    ("Basarili", "Başarılı"),
    ("basarili", "başarılı"),
    ("Basari", "Başarı"),
    ("basari", "başarı"),

    # Vazgec
    ("Vazgec", "Vazgeç"),
    ("vazgec", "vazgeç"),

    # Hazir
    ("Hazirla", "Hazırla"),
    ("hazirla", "hazırla"),
    ("Hazir", "Hazır"),
    ("hazir", "hazır"),

    # Simdi
    ("Simdi", "Şimdi"),
    ("simdi", "şimdi"),

    # Surec
    ("Surecleri", "Süreçleri"),
    ("surecleri", "süreçleri"),
    ("Surec", "Süreç"),
    ("surec", "süreç"),

    # Sure
    ("Sureyle", "Süreyle"),
    ("sureyle", "süreyle"),
    ("Suresi", "Süresi"),
    ("suresi", "süresi"),

    # Ozet
    ("Ozetler", "Özetler"),
    ("ozetler", "özetler"),
    ("Ozet", "Özet"),
    ("ozet", "özet"),

    # Onceki
    ("Onceki", "Önceki"),
    ("onceki", "önceki"),

    # Hesap
    ("hesabindan", "hesabından"),
    ("Hesabindan", "Hesabından"),
    ("hesabina", "hesabına"),
    ("Hesabina", "Hesabına"),
    ("hesabimi", "hesabımı"),
    ("hesabim", "hesabım"),
    ("hesabin", "hesabın"),
    ("hesabini", "hesabını"),

    # Gundem
    ("Gundemdekiler", "Gündemdekiler"),
    ("gundemdekiler", "gündemdekiler"),
    ("Gundem", "Gündem"),
    ("gundem", "gündem"),

    # Calisma
    ("Calisiyorum", "Çalışıyorum"),
    ("calisiyorum", "çalışıyorum"),
    ("calismalar", "çalışmalar"),
    ("Calismalar", "Çalışmalar"),
    ("calisma", "çalışma"),
    ("Calisma", "Çalışma"),

    # Diger
    ("Diger", "Diğer"),
    ("diger", "diğer"),

    # Ozellik
    ("Ozellikleri", "Özellikleri"),
    ("ozellikleri", "özellikleri"),
    ("Ozellikler", "Özellikler"),
    ("ozellikler", "özellikler"),
    ("Ozellik", "Özellik"),
    ("ozellik", "özellik"),

    # Uye
    ("Uyelik", "Üyelik"),
    ("uyelik", "üyelik"),
    ("Uyeler", "Üyeler"),
    ("uyeler", "üyeler"),
    ("Uye", "Üye"),
    ("uye", "üye"),

    # Moderator
    ("Moderatorler", "Moderatörler"),
    ("moderatorler", "moderatörler"),
    ("Moderator", "Moderatör"),
    ("moderator", "moderatör"),

    # Dogrula
    ("dogrulanmadi", "doğrulanmadı"),
    ("Dogrulanmadi", "Doğrulanmadı"),
    ("dogrulanmis", "doğrulanmış"),
    ("Dogrulanmis", "Doğrulanmış"),
    ("dogrulamasi", "doğrulaması"),
    ("Dogrulamasi", "Doğrulaması"),
    ("dogrulama", "doğrulama"),
    ("Dogrulama", "Doğrulama"),
    ("dogrula", "doğrula"),
    ("Dogrula", "Doğrula"),
    ("dogrudan", "doğrudan"),
    ("Dogrudan", "Doğrudan"),

    # Sayfasi / sayfada
    ("sayfasindan", "sayfasından"),
    ("sayfasina", "sayfasına"),
    ("sayfasinda", "sayfasında"),
    ("sayfasini", "sayfasını"),

    # Icin (için)
    ("icin", "için"),
    ("Icin", "İçin"),

    # Ile (ile is correct)

    # Sana
    ("Sana Ozel", "Sana Özel"),
    ("sana ozel", "sana özel"),

    # Neler oluyor
    ("Neler oluyor", "Neler oluyor"),  # correct

    # Duyurul
    ("duyurulmadi", "duyurulmadı"),
    ("duyurulamadi", "duyurulamadı"),

    # Kapat / iptal - correct already

    # Fotograf
    ("fotografi", "fotoğrafı"),
    ("fotografi", "fotoğrafı"),
    ("Fotografi", "Fotoğrafı"),
    ("Fotografin", "Fotoğrafın"),
    ("fotografin", "fotoğrafın"),
    ("fotograflar", "fotoğraflar"),
    ("Fotograflar", "Fotoğraflar"),
    ("Fotograf", "Fotoğraf"),
    ("fotograf", "fotoğraf"),

    # Gorsel
    ("gorseller", "görseller"),
    ("Gorseller", "Görseller"),
    ("gorseli", "görseli"),
    ("Gorseli", "Görseli"),
    ("gorselini", "görselini"),
    ("Gorselini", "Görselini"),
    ("Gorsel", "Görsel"),
    ("gorsel", "görsel"),

    # Secim / sec
    ("Secenekler", "Seçenekler"),
    ("secenekler", "seçenekler"),
    ("Secenek", "Seçenek"),
    ("secenek", "seçenek"),
    ("Seciniz", "Seçiniz"),
    ("seciniz", "seçiniz"),
    ("Seciniz", "Seçiniz"),
    ("Secim", "Seçim"),
    ("secim", "seçim"),
    ("Secili", "Seçili"),
    ("secili", "seçili"),
    ("Secildi", "Seçildi"),
    ("secildi", "seçildi"),

    # Odev
    ("Odevler", "Ödevler"),
    ("odevler", "ödevler"),
    ("Odev", "Ödev"),
    ("odev", "ödev"),

    # Anasayfa
    ("Anasayfa", "Ana Sayfa"),

    # Guncelleme
    ("Guncellemeler", "Güncellemeler"),
    ("guncellemeler", "güncellemeler"),
    ("Guncelleme", "Güncelleme"),
    ("guncelleme", "güncelleme"),

    # Yukleme
    ("Yuklemek", "Yüklemek"),
    ("yuklemek", "yüklemek"),
    ("Yukleme", "Yükleme"),
    ("yukleme", "yükleme"),

    # Kapat
    ("kapat", "kapat"),  # correct

    # Turkce
    ("Turkce", "Türkçe"),
    ("turkce", "türkçe"),

    # Yazim
    ("yazim", "yazım"),
    ("Yazim", "Yazım"),

    # Onem
    ("onemli", "önemli"),
    ("Onemli", "Önemli"),
    ("oneml", "öneml"),

    # Katil / katilim
    ("katilimci", "katılımcı"),
    ("Katilimci", "Katılımcı"),
    ("katilim", "katılım"),
    ("Katilim", "Katılım"),
    ("katilmak", "katılmak"),
    ("Katilmak", "Katılmak"),
    ("Katil", "Katıl"),
    ("katil", "katıl"),

    # Kisi
    ("kisiler", "kişiler"),
    ("Kisiler", "Kişiler"),
    ("kisinin", "kişinin"),
    ("Kisinin", "Kişinin"),
    ("kisiye", "kişiye"),
    ("Kisiye", "Kişiye"),
    ("kisisel", "kişisel"),
    ("Kisisel", "Kişisel"),
    ("Kisi", "Kişi"),
    ("kisi", "kişi"),

    # Uygulama
    ("uygulamanin", "uygulamanın"),
    ("Uygulamanin", "Uygulamanın"),

    # Hosgeldiniz / Merhaba - already correct in most cases

    # Tek cumlede
    ("tek cumlede", "tek cümlede"),
    ("Tek cumlede", "Tek cümlede"),

    # Sartlar
    ("Sartlari", "Şartları"),
    ("sartlari", "şartları"),
    ("Sartlar", "Şartlar"),
    ("sartlar", "şartlar"),
    ("Sart", "Şart"),
    ("sart", "şart"),

    # Gizlilik
    ("Gizlilik Politikasi", "Gizlilik Politikası"),
    ("gizlilik politikasi", "gizlilik politikası"),

    # Hizmet
    ("Hizmet Sartlari", "Hizmet Şartları"),
    ("hizmet sartlari", "hizmet şartları"),

    # Bildirimler - correct already

    # Eklenmis
    ("eklenmis", "eklenmiş"),
    ("Eklenmis", "Eklenmiş"),

    # Yonetici
    ("Yonetici", "Yönetici"),
    ("yonetici", "yönetici"),
    ("Yonet", "Yönet"),
    ("yonet", "yönet"),

    # Tur
    ("Turleri", "Türleri"),
    ("turleri", "türleri"),
    ("Turun", "Türün"),
    ("turun", "türün"),

    # Sunum
    ("sunumlar", "sunumlar"),  # correct

    # Tum
    ("Tum", "Tüm"),
    ("tum", "tüm"),

    # Yuz
    ("yuzde", "yüzde"),
    ("Yuzde", "Yüzde"),

    # Uc (üç - three)
    # Skip "uc" - too risky, appears in many other contexts

    # Ust
    ("Ust kisim", "Üst kısım"),
    ("ust kisim", "üst kısım"),
    ("Ustte", "Üstte"),
    ("ustte", "üstte"),

    # Kucuk
    ("Kucuk", "Küçük"),
    ("kucuk", "küçük"),

    # Buyuk
    ("Buyuk", "Büyük"),
    ("buyuk", "büyük"),

    # Gizli
    ("gizli", "gizli"),  # correct

    # Yedek
    ("yedek", "yedek"),  # correct

    # Takip et - correct

    # Cok
    ("Cok", "Çok"),
    ("cok", "çok"),

    # Kac
    ("Kac", "Kaç"),
    ("kac", "kaç"),

    # Hic
    ("hicbir", "hiçbir"),
    ("Hicbir", "Hiçbir"),
    ("Hic", "Hiç"),
    ("hic", "hiç"),

    # Su an
    ("su an", "şu an"),
    ("Su an", "Şu an"),
    ("su anda", "şu anda"),
    ("Su anda", "Şu anda"),

    # Toplam
    ("toplam", "toplam"),  # correct

    # Kisim
    ("kisimlar", "kısımlar"),
    ("Kisimlar", "Kısımlar"),
    ("Kisim", "Kısım"),
    ("kisim", "kısım"),

    # Bilgi
    ("bilgileriniz", "bilgileriniz"),  # correct
    ("bilgiler", "bilgiler"),  # correct

    # Ekip
    ("ekip", "ekip"),  # correct

    # Fix typos in already-replaced text (safety net for double replacements)
]

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False, str(e)

    original = content
    for wrong, correct in replacements:
        content = content.replace(wrong, correct)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, None
    return False, None

src_dir = "C:/Users/FIRAT/Desktop/Tubitak-Tez/frontend/src"
changed = []
for root, dirs, files in os.walk(src_dir):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', '__pycache__']]
    for fname in files:
        if fname.endswith(('.tsx', '.ts', '.css')):
            fpath = os.path.join(root, fname)
            changed_file, err = fix_file(fpath)
            if changed_file:
                rel = fpath.replace("C:/Users/FIRAT/Desktop/Tubitak-Tez/frontend/src/", "")
                changed.append(rel)
            if err:
                print(f"ERROR {fpath}: {err}")

print(f"Changed {len(changed)} files:")
for f in sorted(changed):
    print(f"  {f}")
