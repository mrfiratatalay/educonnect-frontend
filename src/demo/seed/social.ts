import { posterArt, productArt } from "@/demo/art";
import type { DemoGroup, DemoPost } from "@/demo/types";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

function iso(ms: number) {
  return new Date(Math.min(ms, Date.now() - 30_000)).toISOString();
}

interface GroupSpec {
  id: string;
  name: string;
  slug: string;
  short: string;
  description: string;
  rules: string[];
  avatar: string;
  banner: string;
  category: string;
  owner: string;
  moderators: string[];
  members: string[];
  daysAgo: number;
}

const preset = (kind: "avatars" | "covers", name: string) => `/community-presets/${kind}/${name}.svg`;

const groupSpecs: GroupSpec[] = [
  {
    id: "g-yazilim", name: "RTEÜ Yazılım Topluluğu", slug: "rteu-yazilim-toplulugu", category: "Teknoloji",
    short: "Kod yazan, öğrenen ve birlikte ürün geliştiren öğrencilerin buluşma noktası.",
    description: "Haftalık atölyeler, proje ekipleri ve hackathon'lar düzenliyoruz. Her bölümden öğrenciye açığız; ilk satır kodunu yazacak olan da, açık kaynak projeye katkı veren de burada.",
    rules: ["Saygılı ve yapıcı ol.", "Reklam ve spam paylaşma.", "Soru sorarken kodunu ve hata mesajını ekle.", "Etkinlik duyurularını önce moderatörlere ilet."],
    avatar: preset("avatars", "avatar-code"), banner: preset("covers", "cover-grid"),
    owner: "u-zeynep", moderators: ["u-burak"], members: ["u-baris", "u-onur", "u-kerem", "u-deniz", "u-mert", "u-ece", "u-selin"], daysAgo: 300,
  },
  {
    id: "g-kariyer", name: "Kariyer ve Staj Kulübü", slug: "kariyer-ve-staj-kulubu", category: "Kariyer",
    short: "Staj, CV ve mülakat hazırlığında birbirimize destek oluyoruz.",
    description: "Firma ziyaretleri, CV klinikleri ve mezun söyleşileri düzenliyoruz. Kariyer Günleri'nin öğrenci tarafındaki organizasyonu bizde.",
    rules: ["İlanları kaynağıyla paylaş.", "Kişisel iletişim bilgilerini herkese açık yazma.", "Soruları ilgili gönderinin altında sor."],
    avatar: preset("avatars", "avatar-orbit"), banner: preset("covers", "cover-campus"),
    owner: "u-selin", moderators: ["u-deniz"], members: ["u-zeynep", "u-burak", "u-nazli", "u-ece", "u-kerem", "u-can"], daysAgo: 280,
  },
  {
    id: "g-foto", name: "Fotoğrafçılık Topluluğu", slug: "fotografcilik-toplulugu", category: "Sanat",
    short: "Rize'nin ışığını, yağmurunu ve insanlarını fotoğraflıyoruz.",
    description: "Haftalık tema paylaşımları, şehir gezileri ve dönem sonu sergisi. Telefonla çekenler de çok hoş geldiniz.",
    rules: ["Kendi çektiğin kareleri paylaş.", "İnsan fotoğraflarında izin al.", "Eleştiriyi nazik yap."],
    avatar: preset("avatars", "avatar-dialog"), banner: preset("covers", "cover-studio"),
    owner: "u-can", moderators: [], members: ["u-zeynep", "u-merve", "u-nazli", "u-ece", "u-onur"], daysAgo: 250,
  },
  {
    id: "g-doga", name: "Doğa Sporları Kulübü", slug: "doga-sporlari-kulubu", category: "Spor",
    short: "Kaçkarlar'da yürüyüş, kamp ve doğa fotoğrafçılığı.",
    description: "Her ay en az bir yürüyüş planlıyoruz. Rotaları zorluk derecesiyle paylaşıyor, ekipmanı birbirimize ödünç veriyoruz.",
    rules: ["Rotaya katılmadan önce etkinliğe kayıt ol.", "Doğada iz bırakma.", "Hava durumu kararlarına uy."],
    avatar: preset("avatars", "avatar-orbit"), banner: preset("covers", "cover-campus"),
    owner: "u-ahmet", moderators: ["u-kerem"], members: ["u-zeynep", "u-fatma", "u-onur", "u-baris", "u-can"], daysAgo: 270,
  },
  {
    id: "g-kitap", name: "Kitap Kulübü", slug: "kitap-kulubu", category: "Sosyal",
    short: "Her ay bir kitap, her perşembe bir sohbet.",
    description: "Ayın kitabını birlikte seçiyor, perşembe akşamları kütüphanede tartışıyoruz. Okumadan gelenler de dinleyici olarak bekleniyor.",
    rules: ["Kitap sonlarını spoiler etiketiyle yaz.", "Farklı yorumlara saygı göster."],
    avatar: preset("avatars", "avatar-library"), banner: preset("covers", "cover-forum"),
    owner: "u-merve", moderators: ["u-elif"], members: ["u-zeynep", "u-nazli", "u-ece", "u-deniz"], daysAgo: 230,
  },
  {
    id: "g-girisim", name: "Girişimcilik Kulübü", slug: "girisimcilik-kulubu", category: "Kariyer",
    short: "Fikrini sun, takımını kur, ilk müşterini bul.",
    description: "Pitch geceleri, girişimci söyleşileri ve fikir maratonları düzenliyoruz.",
    rules: ["Fikirleri izinsiz kopyalama.", "Geri bildirimi gerekçesiyle ver."],
    avatar: preset("avatars", "avatar-dialog"), banner: preset("covers", "cover-grid"),
    owner: "u-deniz", moderators: [], members: ["u-selin", "u-burak", "u-mert", "u-baris"], daysAgo: 150,
  },
  {
    id: "g-tip", name: "Tıp Bilim Topluluğu", slug: "tip-bilim-toplulugu", category: "Akademik",
    short: "Seminerler, kan bağışı kampanyaları ve araştırma okumaları.",
    description: "Sağlık bilimleri öğrencileri için seminer ve gönüllülük etkinlikleri düzenliyoruz.",
    rules: ["Tıbbi tavsiye verme; kaynak paylaş.", "Hasta bilgisi paylaşma."],
    avatar: preset("avatars", "avatar-library"), banner: preset("covers", "cover-forum"),
    owner: "u-fatma", moderators: [], members: ["u-ece", "u-elif", "u-merve"], daysAgo: 200,
  },
];

export function createGroups(): DemoGroup[] {
  return groupSpecs.map((spec) => {
    const createdMs = Date.now() - spec.daysAgo * 24 * HOUR;
    const members = [
      { userId: spec.owner, role: "owner" as const, joinedAtUtc: iso(createdMs) },
      ...spec.moderators.map((userId, i) => ({ userId, role: "moderator" as const, joinedAtUtc: iso(createdMs + (i + 1) * 24 * HOUR) })),
      ...spec.members.map((userId, i) => ({ userId, role: "member" as const, joinedAtUtc: iso(createdMs + (i + 3) * 9 * 24 * HOUR) })),
    ];
    return {
      id: spec.id, name: spec.name, slug: spec.slug, shortDescription: spec.short, description: spec.description,
      rules: spec.rules, avatarUrl: spec.avatar, bannerUrl: spec.banner, category: spec.category,
      creatorUserId: spec.owner, isActive: true, members, createdAtUtc: iso(createdMs),
    };
  });
}

interface PostSpec {
  id: string;
  by: string;
  group?: string;
  hoursAgo: number;
  text: string;
  image?: string;
  likes?: string[];
  saves?: string[];
  views?: string[];
  comments?: Array<[string, string]>;
}

const posts: PostSpec[] = [
  { id: "p-01", by: "u-burak", hoursAgo: 2, image: productArt("circuit", "sky"),
    text: "Gömülü sistemler projesi için ESP32 ile kampüsün hava kalitesini ölçen küçük bir istasyon kurduk. Veriler artık canlı panelde akıyor; kodu Yazılım Topluluğu'nda paylaşacağım. #iot #gömülüsistemler",
    likes: ["u-zeynep", "u-baris", "u-onur", "u-kerem", "u-mert", "u-deniz"], views: ["u-selin", "u-ece"],
    comments: [["u-zeynep", "Panel bağlantısını atar mısın? Hackathon'da benzer bir fikir düşünüyorduk."], ["u-baris", "Sensör olarak hangisini kullandınız?"], ["u-burak", "BME680; nem ve gaz ölçümünü de yapıyor."]] },
  { id: "p-02", by: "u-zeynep", hoursAgo: 5,
    text: "Vize haftası başladı. Kütüphanede yer bulmak için erken gelen kazanıyor, herkese kolay gelsin! Sınav takvimini EduAI'a sordum, kaynağıyla birlikte verdi. #vizehaftası",
    likes: ["u-burak", "u-selin", "u-can", "u-merve", "u-baris", "u-nazli", "u-fatma", "u-kerem"], views: ["u-onur", "u-ece"],
    comments: [["u-nazli", "3. kat sabah 9'da doluyordu, haklısın."], ["u-can", "Kolay gelsin!"]] },
  { id: "p-03", by: "u-selin", hoursAgo: 26, image: posterArt("career"),
    text: "Kariyer Günleri'nde 12 firma kampüse geliyor. CV'ni yanında getir, staj görüşmesi fırsatı var. Program etkinlikler sayfasında. #kariyergünleri #staj",
    likes: ["u-zeynep", "u-deniz", "u-burak", "u-nazli", "u-ece", "u-kerem", "u-can", "u-mert", "u-onur", "u-baris"], saves: ["u-zeynep", "u-ece"],
    comments: [["u-deniz", "Kulüp standında gönüllü arıyoruz, yazın!"], ["u-zeynep", "CV kliniği kısmı çok iyi fikir."]] },
  { id: "p-04", by: "u-ahmet", group: "g-doga", hoursAgo: 27, image: posterArt("kackar"),
    text: "Cumartesi Kaçkarlar'da Ayder – Gelinkaya rotasını yürüyoruz. Kontenjan doldu ama yedek listeye yazılabilirsiniz. Yağmurluk ve su şart! #kaçkar #doğayürüyüşü",
    likes: ["u-zeynep", "u-kerem", "u-fatma", "u-onur", "u-baris", "u-can", "u-nazli"],
    comments: [["u-fatma", "Başlangıç saati 07.30 mu?"], ["u-ahmet", "Evet, Rize otogarının önünden hareket ediyoruz."]] },
  { id: "p-05", by: "u-merve", group: "g-kitap", hoursAgo: 49, image: posterArt("books"),
    text: "Bu ayın kitabı: Sabahattin Ali'den Kürk Mantolu Madonna. Perşembe akşamı seminer salonunda tartışıyoruz; okuyamayanlar da gelsin. #kitapkulübü",
    likes: ["u-zeynep", "u-elif", "u-nazli", "u-ece", "u-deniz"], comments: [["u-elif", "Raif Efendi'nin defterini mutlaka konuşalım."]] },
  { id: "p-06", by: "u-can", hoursAgo: 53, image: posterArt("sunset"),
    text: "Dün akşam sahil yolundan gün batımı. Rize'de güneşi görmek başlı başına bir etkinlik. #rize #fotoğraf",
    likes: ["u-zeynep", "u-merve", "u-nazli", "u-ece", "u-selin", "u-onur", "u-fatma", "u-ahmet", "u-baris"], saves: ["u-nazli"],
    comments: [["u-nazli", "Bu karenin çekildiği yeri merak ettim."], ["u-can", "Sahil parkının önü, saat 19.10 civarı."]] },
  { id: "p-07", by: "u-baris", hoursAgo: 3,
    text: "Veri yapıları ödevinde AVL ağacının döndürme işlemleri beni benden aldı. Adım adım görselleştiren bir kaynak bilen var mı? #algoritma",
    likes: ["u-onur", "u-zeynep", "u-kerem"],
    comments: [["u-zeynep", "VisuAlgo'ya bak, döndürmeleri adım adım gösteriyor."], ["u-onur", "Kağıtta çizerek çalışınca oturdu. Önce sol-sol, sonra sol-sağ durumunu ayır."]] },
  { id: "p-08", by: "u-fatma", hoursAgo: 96, image: posterArt("blood"),
    text: "Tıp Bilim Topluluğu olarak kan bağışı kampanyası düzenliyoruz. Kızılay aracı bu hafta merkez yerleşkede; saatler etkinlik sayfasında. #kanbağışı",
    likes: ["u-ece", "u-elif", "u-zeynep", "u-merve", "u-ahmet", "u-kerem", "u-nazli"] },
  { id: "p-09", by: "u-deniz", hoursAgo: 120,
    text: "Girişimcilik Kulübü'nün ilk pitch gecesinde 6 takım sunum yaptı. Kampüs içi ikinci el kitap platformu fikri birinci oldu; ikinci gece için başvurular açık. #girişimcilik",
    likes: ["u-selin", "u-burak", "u-mert", "u-zeynep", "u-baris"] },
  { id: "p-10", by: "u-nazli", hoursAgo: 6,
    text: "Yemekhanede bugün kuru fasulye–pilav günü, sıra 12.00'de kapıya kadar uzanıyor. 11.30'da gidin derim. #yemekhane",
    likes: ["u-can", "u-merve", "u-ece", "u-kerem", "u-baris", "u-zeynep", "u-deniz", "u-onur"],
    comments: [["u-kerem", "Teşekkürler, yola çıktım."], ["u-ece", "Tatlı da var mıydı?"]] },
  { id: "p-11", by: "u-onur", hoursAgo: 30,
    text: "KTÜ'den selamlar! Trabzon ve Rize'deki yazılım toplulukları ortak bir hackathon yapsa nasıl olur? #hackathon",
    likes: ["u-zeynep", "u-burak", "u-baris"], comments: [["u-zeynep", "Çok isteriz! Mesaj attım, detayları konuşalım."]] },
  { id: "p-12", by: "u-zeynep", group: "g-yazilim", hoursAgo: 46, image: posterArt("hackathon"),
    text: "Hackathon kayıtları açıldı! 3-4 kişilik takımlarla 48 saat boyunca kampüs için ürün geliştiriyoruz. Mentörler, atölyeler ve ödüller etkinlik sayfasında. #hackathon #rteüyazılım",
    likes: ["u-burak", "u-baris", "u-onur", "u-kerem", "u-deniz", "u-mert", "u-ece", "u-selin", "u-fatma", "u-can", "u-ahmet", "u-nazli", "u-elif"],
    saves: ["u-baris", "u-kerem", "u-ece"],
    comments: [["u-baris", "Takım arıyorum, frontend tarafında iyiyim!"], ["u-burak", "Mentör listesini yarın paylaşıyoruz."], ["u-kerem", "İnşaat bölümünden de katılabiliyor muyuz?"], ["u-zeynep", "Tabii, her bölüme açık. Farklı bölümlerden kurulan takımlar en iyi fikirleri çıkarıyor."]] },
  { id: "p-13", by: "u-elif", hoursAgo: 75,
    text: "Hatırlatma: Satış ilanlarını akışta değil Market bölümünde paylaşalım; ilanınız orada fiyat ve kategoriyle daha çok kişiye ulaşır. Gönderilerde kişisel iletişim bilgisi paylaşmamaya özen gösterin. #duyuru",
    likes: ["u-mert", "u-zeynep", "u-merve"] },
  { id: "p-14", by: "u-kerem", hoursAgo: 98,
    text: "Statik dersinden iki yılın çözümlü soru notlarını Market'e koydum, ihtiyacı olan bakabilir. #notpaylaşımı", likes: ["u-baris", "u-ahmet"] },
  { id: "p-15", by: "u-ece", hoursAgo: 7,
    text: "Diş hekimliği 1. sınıf olarak anatomi laboratuvarında ilk günüm. Heyecan ve biraz korku bir arada. #ilkgün",
    likes: ["u-fatma", "u-can", "u-zeynep", "u-nazli", "u-merve", "u-elif"], comments: [["u-fatma", "Alışacaksın, ilk hafta herkes öyle!"]] },
  { id: "p-16", by: "u-mert", hoursAgo: 146,
    text: "EduConnect güncellemesi: Akışınız artık takip ettikleriniz, topluluklarınız ve ilgi alanlarınıza göre sıralanıyor. Bir gönderinin neden önerildiğini kartın üstündeki etikette görebilirsiniz. #duyuru",
    likes: ["u-zeynep", "u-burak", "u-selin", "u-deniz", "u-elif", "u-baris", "u-onur"] },
  { id: "p-17", by: "u-burak", group: "g-yazilim", hoursAgo: 22,
    text: "Bu hafta Git ve GitHub atölyesi yapıyoruz. Bilgisayarını getir, ilk pull request'ini orada aç. #rteüyazılım #git",
    likes: ["u-zeynep", "u-baris", "u-kerem", "u-ece", "u-mert"] },
  { id: "p-18", by: "u-selin", group: "g-kariyer", hoursAgo: 72,
    text: "Staj başvurusu için ön yazı şablonumuzu kulüp dosyalarına ekledik. Göz atın, sorularınızı bu gönderinin altına yazın. #staj",
    likes: ["u-zeynep", "u-nazli", "u-ece", "u-kerem"],
    comments: [["u-ece", "1. sınıflar için de staj fırsatı var mı?"], ["u-selin", "Gönüllü proje ve gözlem stajları var, Kariyer Günleri'nde konuşalım."]] },
  { id: "p-19", by: "u-can", group: "g-foto", hoursAgo: 94,
    text: "Bu haftanın teması: Yağmur. En iyi üç kare kulüp sayfasında sergilenecek. Rize'de malzeme sıkıntısı yok. #fotoğraf",
    likes: ["u-zeynep", "u-merve", "u-nazli", "u-onur", "u-ece"] },
  { id: "p-20", by: "u-ahmet", hoursAgo: 150,
    text: "Geçen haftaki Zilkale yürüyüşünden aklımda kalan: 21 kişiydik, kimse kaybolmadı, herkes çay molasını hak etti. #kaçkar",
    likes: ["u-kerem", "u-fatma", "u-zeynep", "u-onur"] },
  { id: "p-21", by: "u-zeynep", hoursAgo: 97,
    text: "Staj başvurusu yaparken GitHub profilindeki README'yi güncellemek gerçekten fark yaratıyor. Projelerine kısa bir açıklama ve ekran görüntüsü ekle derim. #staj #kariyer",
    likes: ["u-selin", "u-burak", "u-baris", "u-deniz", "u-onur", "u-mert"], saves: ["u-baris", "u-ece"] },
  { id: "p-22", by: "u-merve", hoursAgo: 118,
    text: "Kütüphanenin çalışma saatlerini soranlara: EduAI'a sorunca resmî kaynağın bağlantısıyla birlikte cevap veriyor, oradan bakmak en sağlıklısı. #kütüphane",
    likes: ["u-elif", "u-nazli"] },
  { id: "p-23", by: "u-deniz", hoursAgo: 50,
    text: "İktisat bölümü olarak Rize'deki çay üreticilerinin kooperatifleşmesi üzerine saha çalışması yapıyoruz. Gönüllü anketör arıyoruz; yazın, birlikte gezelim. #araştırma",
    likes: ["u-selin", "u-mert", "u-nazli", "u-zeynep"] },
  { id: "p-24", by: "u-baris", hoursAgo: 190,
    text: "İlk açık kaynak katkım kabul edildi! Küçük bir dokümantasyon düzeltmesiydi ama motivasyonu büyük. #açıkkaynak",
    likes: ["u-zeynep", "u-burak", "u-onur", "u-kerem", "u-mert"], comments: [["u-zeynep", "Tebrikler! Sırada kod katkısı var."]] },
  { id: "p-25", by: "u-fatma", group: "g-tip", hoursAgo: 52,
    text: "Perşembe 'Klinik Araştırmaya Giriş' semineri var. Sunum dosyalarını seminerden sonra buraya yükleyeceğim.", likes: ["u-ece", "u-elif"] },
  { id: "p-26", by: "u-nazli", hoursAgo: 73,
    text: "Turizm öğrencileri olarak Ayder'de rehberlik pratiği yaptık. Yabancı ziyaretçilerle konuşmak en iyi dil pratiği. #turizm #rize",
    likes: ["u-can", "u-selin", "u-merve", "u-zeynep"] },
  { id: "p-27", by: "u-onur", hoursAgo: 214,
    text: "Algoritma yarışmalarına hazırlanmak için haftada iki akşam çevrim içi çalışma grubu kuruyoruz. Katılmak isteyen yazsın. #algoritma",
    likes: ["u-baris", "u-zeynep", "u-burak"] },
  { id: "p-28", by: "u-kerem", hoursAgo: 32,
    text: "Akşam ring seferlerinin saatlerini bilen var mı? Kütüphaneden çıkınca durakta bekliyorum.",
    likes: ["u-nazli"], comments: [["u-baris", "EduAI'a sor, ulaşım bilgisi bilgi tabanında var."]] },
  { id: "p-29", by: "u-elif", group: "g-kitap", hoursAgo: 145,
    text: "Okuma listemize önerilerinizi bekliyoruz. Bu dönem Türk edebiyatının klasiklerine ağırlık verelim mi?",
    likes: ["u-merve", "u-nazli", "u-zeynep"],
    comments: [["u-merve", "Bence evet, Tutunamayanlar'ı da ekleyelim."], ["u-nazli", "Biraz da çağdaş yazarlardan olsun."]] },
  { id: "p-30", by: "u-zeynep", hoursAgo: 170,
    text: "Backend dersinde yazdığımız REST API'ye refresh token rotasyonu ekledik: aynı token ikinci kez kullanılırsa istek reddediliyor. Güvenlik küçük detaylarda saklı. #backend",
    likes: ["u-burak", "u-onur", "u-baris", "u-mert", "u-deniz"],
    comments: [["u-onur", "Token'ları veritabanında hash'liyor musunuz?"], ["u-zeynep", "Henüz değil, sıradaki iyileştirme o."]] },
];

export function createPosts(): DemoPost[] {
  return posts.map((spec) => {
    const createdMs = Date.now() - spec.hoursAgo * HOUR;
    const likes = (spec.likes ?? []).map((userId, i) => ({ userId, createdAtUtc: iso(createdMs + (i + 1) * 6 * MINUTE) }));
    const bookmarks = (spec.saves ?? []).map((userId, i) => ({ userId, createdAtUtc: iso(createdMs + (i + 2) * 9 * MINUTE) }));
    const comments = (spec.comments ?? []).map(([userId, content], i) => ({
      id: `${spec.id}-c${i + 1}`, userId, content, createdAtUtc: iso(createdMs + (i + 1) * 17 * MINUTE),
    }));
    const viewerIds = Array.from(new Set([
      ...likes.map((like) => like.userId), ...bookmarks.map((save) => save.userId),
      ...comments.map((comment) => comment.userId), ...(spec.views ?? []),
    ])).filter((userId) => userId !== spec.by);
    return {
      id: spec.id, userId: spec.by, groupId: spec.group, content: spec.text, imageUrl: spec.image,
      isDeleted: false, likes, bookmarks, viewerIds, comments, createdAtUtc: iso(createdMs),
    };
  });
}
