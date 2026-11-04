import { logoArt, productArt, type PALETTES, type ProductShape } from "@/demo/art";
import { daysUntilWeekday, isoAgo, isoAtLocal } from "@/demo/time";
import type { DemoDiscount, DemoEvent, DemoProduct, DemoProductCondition } from "@/demo/types";

interface EventSpec {
  id: string;
  title: string;
  description: string;
  location: string;
  day: number;
  start: [number, number];
  end: [number, number];
  endDay?: number;
  by: string;
  group?: string;
  max: number;
  category: string;
  attendees: string[];
  /** Registrations from students outside the demo cast, so counts look like a real campus. */
  others: number;
}

const kackarDay = daysUntilWeekday(6);

const events: EventSpec[] = [
  {
    id: "e-hackathon", title: "RTEÜ Hackathon: Kampüs İçin Kod", by: "u-zeynep", group: "g-yazilim", category: "Teknoloji",
    description: "48 saat boyunca 3-4 kişilik takımlarla kampüs hayatını kolaylaştıracak bir ürün geliştiriyoruz. İlk gün fikir sunumları ve mentör eşleşmeleri, ikinci gün geliştirme ve demo saati. Her bölüme açık; takımın yoksa etkinlikte kuruyoruz.",
    location: "Mühendislik Fakültesi Bilgisayar Laboratuvarları", day: 9, start: [10, 0], endDay: 10, end: [18, 0], max: 60,
    attendees: ["u-burak", "u-baris", "u-onur", "u-kerem", "u-deniz", "u-ece", "u-selin"], others: 31,
  },
  {
    id: "e-kariyer", title: "Kariyer Günleri", by: "u-selin", group: "g-kariyer", category: "Kariyer",
    description: "12 firmanın katıldığı gün boyu süren etkinlikte firma sunumları, birebir staj görüşmeleri ve CV kliniği var. Öğrenci kimliğini ve basılı CV'ni yanında getir.",
    location: "Merkez Yerleşke Konferans Salonu", day: 3, start: [10, 0], end: [17, 0], max: 200,
    attendees: ["u-zeynep", "u-deniz", "u-nazli", "u-ece", "u-kerem"], others: 21,
  },
  {
    id: "e-kackar", title: "Kaçkar Yürüyüşü: Ayder – Gelinkaya", by: "u-ahmet", group: "g-doga", category: "Spor",
    description: "Ayder'den Gelinkaya'ya yaklaşık 12 km'lik orta zorlukta bir rota. Ulaşımı kulüp ayarlıyor. Su geçirmez mont, rahat yürüyüş ayakkabısı ve kumanya getirmeyi unutma.",
    location: "Ayder Yaylası (toplanma: Rize otogarı)", day: kackarDay, start: [7, 30], end: [18, 0], max: 25,
    attendees: ["u-zeynep", "u-kerem", "u-fatma", "u-onur", "u-baris", "u-can"], others: 19,
  },
  {
    id: "e-kitap", title: "Kitap Kulübü: Kürk Mantolu Madonna", by: "u-merve", group: "g-kitap", category: "Sosyal",
    description: "Ayın kitabını tartışıyoruz. Okumamış olsan da dinleyici olarak katılabilirsin; çay bizden.",
    location: "Merkez Kütüphane Seminer Salonu", day: 2, start: [19, 0], end: [21, 0], max: 30,
    attendees: ["u-zeynep", "u-elif", "u-nazli", "u-ece"], others: 8,
  },
  {
    id: "e-git", title: "Git ve GitHub Atölyesi", by: "u-burak", group: "g-yazilim", category: "Teknoloji",
    description: "Sıfırdan Git: commit, branch, merge ve ilk pull request. Bilgisayarını ve GitHub hesabını hazır getir.",
    location: "Mühendislik Fakültesi Z-12 Laboratuvarı", day: 5, start: [18, 0], end: [20, 30], max: 40,
    attendees: ["u-zeynep", "u-baris", "u-kerem", "u-ece", "u-mert"], others: 17,
  },
  {
    id: "e-foto", title: "Fotoğraf Gezisi: Rize Sahili", by: "u-can", group: "g-foto", category: "Sosyal",
    description: "Gün batımına doğru sahil boyunca yürüyüp çekim yapıyoruz. Telefonla çekenler de gelsin.",
    location: "Rize Sahil Parkı", day: 6, start: [16, 0], end: [19, 0], max: 20,
    attendees: ["u-merve", "u-nazli", "u-onur"], others: 6,
  },
  {
    id: "e-kan", title: "Kan Bağışı Kampanyası", by: "u-fatma", group: "g-tip", category: "Sosyal",
    description: "Kızılay aracı gün boyu merkez yerleşkede. Bağıştan önce kahvaltı yapmayı ve kimliğini yanına almayı unutma.",
    location: "Merkez Yerleşke, Kızılay aracı", day: 1, start: [9, 0], end: [16, 0], max: 150,
    attendees: ["u-ece", "u-elif", "u-merve", "u-ahmet", "u-kerem"], others: 36,
  },
  {
    id: "e-pitch", title: "Pitch Gecesi #2", by: "u-deniz", group: "g-girisim", category: "Kariyer",
    description: "Fikrini 5 dakikada anlat, jüriden ve izleyicilerden geri bildirim al. Başvuru için kulüp sayfasındaki formu doldur.",
    location: "İİBF Konferans Salonu", day: 12, start: [18, 30], end: [21, 30], max: 80,
    attendees: ["u-selin", "u-burak", "u-mert", "u-baris"], others: 13,
  },
];

export function createEvents(): DemoEvent[] {
  return events.map((spec) => ({
    id: spec.id, title: spec.title, description: spec.description, location: spec.location,
    startDateUtc: isoAtLocal(spec.day, ...spec.start),
    endDateUtc: isoAtLocal(spec.endDay ?? spec.day, ...spec.end),
    creatorUserId: spec.by, groupId: spec.group, maxParticipants: spec.max, category: spec.category,
    participants: [
      ...spec.attendees.map((userId, i) => ({ userId, status: "registered" as const, registeredAtUtc: isoAgo({ hours: 3 + i * 5 }) })),
      ...Array.from({ length: spec.others }, (_, i) => ({
        userId: `${spec.id}-guest-${i + 1}`, status: "registered" as const, registeredAtUtc: isoAgo({ hours: 8 + i * 2 }),
      })),
    ],
    createdAtUtc: isoAgo({ days: 6 }),
  }));
}

type ProductSpec = [
  id: string, title: string, description: string, price: number, categoryId: string | undefined,
  condition: DemoProductCondition, city: string, negotiable: boolean, sellerId: string,
  shape: ProductShape, palette: keyof typeof PALETTES, daysAgo: number,
];

const products: ProductSpec[] = [
  ["pr-01", "Thomas' Calculus 14. baskı", "Matematik 1-2 derslerinde kullandım. Birkaç sayfada kurşun kalem notu var, onun dışında temiz. Kampüste elden teslim edebilirim.", 450, "cat-books", "good", "Rize", true, "u-baris", "books", "teal", 2],
  ["pr-02", "Casio fx-991EX bilimsel hesap makinesi", "Bir dönem kullanıldı, kutusu ve kılıfı duruyor. Sınavlarda izin verilen modeldir.", 900, "cat-electronics", "likeNew", "Rize", false, "u-kerem", "calculator", "slate", 1],
  ["pr-03", "Mimari çizim seti: paralel cetvel ve pergel", "Mimarlık 1. sınıf atölye dersleri için aldığım set. Paralel cetvel 80 cm.", 650, "cat-stationery", "good", "Rize", true, "u-can", "drafting", "amber", 4],
  ["pr-04", "Bahar konseri bileti (2 adet)", "Etkinliğe katılamayacağım için satıyorum. İki bilet birlikte, fiyat ikisi için.", 300, "cat-tickets", "new", "Rize", false, "u-nazli", "ticket", "violet", 0],
  ["pr-05", "Kablosuz kulaklık", "Gürültü engelleme özelliği var, pil ömrü hâlâ iyi. Trabzon'dayım; kargo ya da Rize'ye gelince teslim.", 1100, "cat-electronics", "good", "Trabzon", true, "u-onur", "headphones", "sky", 3],
  ["pr-06", "LED çalışma masası lambası", "Üç ışık modu ve USB girişi var. Yurt odası için ideal.", 250, "cat-electronics", "likeNew", "Rize", false, "u-merve", "lamp", "amber", 5],
  ["pr-07", "Netter İnsan Anatomisi Atlası", "Tıp 1. sınıfta kullandım, sayfalarında yıpranma yok. Diş hekimliği öğrencileri için de uygun.", 1200, "cat-books", "good", "Rize", true, "u-fatma", "books", "rose", 6],
  ["pr-08", "Arduino başlangıç seti", "Arduino Uno, breadboard, sensörler ve kablolar eksiksiz. Gömülü sistemlere başlamak için birebir.", 700, "cat-electronics", "likeNew", "Rize", true, "u-burak", "circuit", "teal", 2],
  ["pr-09", "İktisada giriş ders notları ve soru bankası", "Kendi tuttuğum notlar ve çözümlü sorular. Ara sınav öncesi tekrar için çok işe yarar.", 150, "cat-books", "fair", "Rize", false, "u-deniz", "books", "amber", 8],
  ["pr-10", "Şehir bisikleti", "Kampüs ile şehir merkezi arasında iki yıl kullandım. Vites ve frenler yeni bakım gördü.", 3500, undefined, "good", "Rize", true, "u-ahmet", "bike", "lime", 9],
  ["pr-11", "Laptop bölmeli sırt çantası", "15,6 inç laptop sığıyor, su geçirmez kumaş. Sadece bir dönem kullanıldı.", 400, undefined, "likeNew", "Rize", false, "u-ece", "backpack", "violet", 7],
  ["pr-12", "Statik ve Mukavemet çözümlü soru kitabı", "Statik dersi için son iki yılın çıkmış soruları ve çözümleri.", 200, "cat-books", "good", "Rize", true, "u-kerem", "books", "sky", 4],
  ["pr-13", "Clean Code (Türkçe baskı)", "Yazılım geliştirmeye yeni başlayanlara önerdiğim kitap. Altı çizili yer yok.", 280, "cat-books", "likeNew", "Rize", true, "u-zeynep", "books", "violet", 1],
];

export function createProducts(): DemoProduct[] {
  return products.map(([id, title, description, price, categoryId, condition, city, isNegotiable, sellerId, shape, palette, daysAgo]) => ({
    id, title, description, price, categoryId, condition, city, isNegotiable, sellerId,
    isActive: true, imageUrls: [productArt(shape, palette)], createdAtUtc: isoAgo({ days: daysAgo, hours: 2 }),
  }));
}

export function createDiscounts(): DemoDiscount[] {
  const discount = (id: string, businessName: string, title: string, description: string, rate: number, code: string, days: number, color: string): DemoDiscount => ({
    id, businessName, title, description, discountRate: rate, discountCode: code,
    logoUrl: logoArt(businessName, color), validUntilUtc: isoAgo({ days: -days }), isActive: true,
  });
  return [
    discount("d-1", "Kampüs Kafe", "Tüm sıcak içeceklerde %20 indirim", "Öğrenci kimliğini göstermen yeterli. Hafta içi her gün geçerli.", 20, "KAMPUS20", 75, "#0F766E"),
    discount("d-2", "Kitap Durağı", "Ders kitaplarında %15 indirim", "Seçili akademik yayınlarda geçerli, stokla sınırlı.", 15, "KITAP15", 40, "#6D28D9"),
    discount("d-3", "Yeşil Vadi Spor Salonu", "Öğrenci üyeliğinde %25 indirim", "Üç aylık ve dönemlik üyeliklerde geçerli.", 25, "SPOR25", 90, "#15803D"),
    discount("d-4", "Kıyı Fotokopi", "Ders notu çıktılarında %10 indirim", "Siyah-beyaz ve renkli çıktılarda geçerli.", 10, "KOPYA10", 30, "#0369A1"),
    discount("d-5", "Sahil Çay Bahçesi", "Çay ve simit menüsünde %30 indirim", "Hafta sonu sahil şubesinde geçerli.", 30, "CAY30", 20, "#B45309"),
  ];
}
