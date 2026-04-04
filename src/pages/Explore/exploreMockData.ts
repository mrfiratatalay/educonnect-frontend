import type { AppEvent } from "@/features/events/types";
import type { AppGroup } from "@/features/groups/types";
import type { Discount } from "@/types";

const minimumPreviewItemCount = 6;

export const previewGroupsSeed: AppGroup[] = [
  {
    id: "preview-group-1",
    name: "Bilgisayar Mühendisliği Not Halkası",
    description:
      "Ders notları, sınav haftası planları ve bölüm içi kısa duyurular için sakin bir çalışma topluluğu.",
    category: "Akademik",
    creatorUserId: "preview-user-1",
    creatorName: "Elif Kaya",
    memberCount: 164,
    isMember: true,
    createdAt: "2026-03-18T09:00:00Z",
  },
  {
    id: "preview-group-2",
    name: "Açık Kaynak Atölyesi",
    description:
      "Küçük ama düzenli buluşmalarla Git, issue yönetimi ve ekip içi üretim pratiği yapan bir topluluk.",
    category: "Teknoloji",
    creatorUserId: "preview-user-2",
    creatorName: "Mert Akın",
    memberCount: 73,
    isMember: false,
    createdAt: "2026-03-21T11:30:00Z",
  },
  {
    id: "preview-group-3",
    name: "Kampüs Fotoğraf Kulübü",
    description:
      "Fener Kampüsü ve sahil hattında sade kareler yakalamayı seven öğrencilerin haftalık buluşma alanı.",
    category: "Sanat",
    creatorUserId: "preview-user-3",
    creatorName: "Duru Yılmaz",
    memberCount: 58,
    isMember: false,
    createdAt: "2026-03-12T15:15:00Z",
  },
  {
    id: "preview-group-4",
    name: "Kariyer Kahvesi",
    description:
      "Staj deneyimleri, CV düzeni ve mülakat notları üzerine kısa ama faydalı paylaşımlar yapılan topluluk.",
    category: "Kariyer",
    creatorUserId: "preview-user-4",
    creatorName: "Can Demir",
    memberCount: 91,
    isMember: true,
    createdAt: "2026-03-25T08:45:00Z",
  },
  {
    id: "preview-group-5",
    name: "Karadeniz Yürüyüş Rotası",
    description:
      "Hafta sonu kısa kaçamaklar, sahil yürüyüşleri ve doğa planları için doğal ritimde akan küçük bir grup.",
    category: "Sosyal",
    creatorUserId: "preview-user-5",
    creatorName: "Sena Arslan",
    memberCount: 47,
    isMember: false,
    createdAt: "2026-03-10T13:20:00Z",
  },
  {
    id: "preview-group-6",
    name: "Kampüs Spor Saati",
    description:
      "Ders aralarında basketbol, koşu ve salon buluşmalarını hızlıca organize eden aktif öğrenci topluluğu.",
    category: "Spor",
    creatorUserId: "preview-user-6",
    creatorName: "Yusuf Çelik",
    memberCount: 112,
    isMember: false,
    createdAt: "2026-03-27T17:00:00Z",
  },
];

export const previewEventsSeed: AppEvent[] = [
  {
    id: "preview-event-1",
    title: "Portfolyo Düzenleme Oturumu",
    description:
      "Behance ve GitHub profillerini sade, okunaklı ve daha güven veren bir çizgiye çekmek için ortak çalışma buluşması.",
    location: "Merkez Kütüphane Sessiz Alan",
    startDate: "2026-04-06T12:30:00Z",
    endDate: "2026-04-06T14:00:00Z",
    creatorUserId: "preview-user-4",
    creatorName: "Can Demir",
    maxParticipants: 24,
    participantCount: 18,
    isRegistered: true,
    category: "Kariyer",
  },
  {
    id: "preview-event-2",
    title: "Python Study Jam",
    description:
      "Temel veri analizi örnekleri üzerinden birlikte ilerlenen, gösterişsiz ama verimli bir akşam çalışması.",
    location: "D Blok 204",
    startDate: "2026-04-07T15:00:00Z",
    endDate: "2026-04-07T17:30:00Z",
    creatorUserId: "preview-user-2",
    creatorName: "Mert Akın",
    groupId: "preview-group-2",
    groupName: "Açık Kaynak Atölyesi",
    maxParticipants: 32,
    participantCount: 21,
    isRegistered: false,
    category: "Teknoloji",
  },
  {
    id: "preview-event-3",
    title: "Açık Hava Film Gecesi",
    description:
      "Kampüs içinde sakin bir akşam geçirmek isteyenler için battaniyeli, kısa sohbetli film gösterimi.",
    location: "Fener Kampüsü Çim Alan",
    startDate: "2026-04-08T18:30:00Z",
    endDate: "2026-04-08T21:00:00Z",
    creatorUserId: "preview-user-3",
    creatorName: "Duru Yılmaz",
    maxParticipants: 120,
    participantCount: 84,
    isRegistered: false,
    category: "Sosyal",
  },
  {
    id: "preview-event-4",
    title: "CV Kliniği",
    description:
      "CV'sini kısa sürede toparlamak isteyen öğrenciler için bire bir geri bildirim ve örnek düzen oturumu.",
    location: "Kariyer Merkezi Görüşme Odası",
    startDate: "2026-04-10T09:30:00Z",
    endDate: "2026-04-10T12:00:00Z",
    creatorUserId: "preview-user-4",
    creatorName: "Can Demir",
    groupId: "preview-group-4",
    groupName: "Kariyer Kahvesi",
    maxParticipants: 20,
    participantCount: 16,
    isRegistered: true,
    category: "Kariyer",
  },
  {
    id: "preview-event-5",
    title: "Gün Doğumu Sahil Koşusu",
    description:
      "Pazar sabahını erken ve temiz bir başlangıçla açmak isteyenler için hafif tempolu sahil rotası.",
    location: "Sahil Yolu Başlangıç Noktası",
    startDate: "2026-04-12T05:45:00Z",
    endDate: "2026-04-12T07:00:00Z",
    creatorUserId: "preview-user-6",
    creatorName: "Yusuf Çelik",
    groupId: "preview-group-6",
    groupName: "Kampüs Spor Saati",
    maxParticipants: 40,
    participantCount: 23,
    isRegistered: false,
    category: "Spor",
  },
  {
    id: "preview-event-6",
    title: "Çay ve Networking",
    description:
      "Kulüp başkanları, etkinlik düzenleyenler ve yeni tanışmak isteyen öğrenciler için kısa buluşma.",
    location: "Öğrenci Merkezi Fuaye",
    startDate: "2026-04-13T13:00:00Z",
    endDate: "2026-04-13T14:30:00Z",
    creatorUserId: "preview-user-1",
    creatorName: "Elif Kaya",
    maxParticipants: 60,
    participantCount: 34,
    isRegistered: false,
    category: "Akademik",
  },
];

export const previewDiscountsSeed: Discount[] = [
  {
    id: "preview-discount-1",
    businessName: "Fener Kitabevi",
    title: "Ders kitaplarında öğrenci indirimi",
    description:
      "Güncel dönem kitaplarında kasada öğrenci kartını gösterenlere doğrudan indirim uygulanır.",
    discountRate: 15,
    validUntil: "2026-06-15T23:59:59Z",
    isActive: true,
    code: "KAMPUS15",
  },
  {
    id: "preview-discount-2",
    businessName: "Çay Durağı",
    title: "Çay ve tost menüsünde öğleden sonra indirimi",
    description:
      "Hafta içi 14:00 sonrasında kampüsten gelen öğrencilere sıcak menüde daha sakin fiyatlar sunuluyor.",
    discountRate: 20,
    validUntil: "2026-05-30T23:59:59Z",
    isActive: true,
    code: "CAY20",
  },
  {
    id: "preview-discount-3",
    businessName: "Kampüs Kopyalama",
    title: "Tez ve proje baskılarında toplu fiyat",
    description:
      "Renkli baskı ve spiral cilt işlerinde öğrencilere özel sabit oranlı indirim uygulanıyor.",
    discountRate: 18,
    validUntil: "2026-05-20T23:59:59Z",
    isActive: true,
    code: "PROJE18",
  },
  {
    id: "preview-discount-4",
    businessName: "Sahil Kahvesi",
    title: "Filtre kahve yanında tatlı indirimi",
    description:
      "Akşamüstü çalışmak isteyenler için filtre kahve ve küçük tatlı menüsünde geçerli kampanya.",
    discountRate: 25,
    validUntil: "2026-04-30T23:59:59Z",
    isActive: true,
    code: "SAHIL25",
  },
  {
    id: "preview-discount-5",
    businessName: "Tekno Ofis",
    title: "Kulaklık ve çevre birimlerinde öğrenci fırsatı",
    description:
      "Klavye, mouse ve kulaklık gibi günlük ekipmanlarda dönem sonuna kadar indirim sunuluyor.",
    discountRate: 12,
    validUntil: "2026-06-30T23:59:59Z",
    isActive: true,
    code: "OFIS12",
  },
  {
    id: "preview-discount-6",
    businessName: "Kampüs Spor Merkezi",
    title: "Aylık üyelikte bahar dönemi kampanyası",
    description:
      "Aylık salon üyeliğinde öğrenciler için daha yumuşak fiyatlı bahar paketi sunuluyor.",
    discountRate: 30,
    validUntil: "2026-05-31T23:59:59Z",
    isActive: true,
    code: "SPOR30",
  },
];

export function isPreviewGroupId(groupId?: string | null) {
  return Boolean(groupId?.startsWith("preview-group-") || groupId?.startsWith("local-group-"));
}

export function isPreviewEventId(eventId?: string | null) {
  return Boolean(eventId?.startsWith("preview-event-") || eventId?.startsWith("local-event-"));
}

export function mergePreviewGroups(groups: AppGroup[], previewGroups: AppGroup[]) {
  return mergePreviewItems(groups, previewGroups, minimumPreviewItemCount);
}

export function mergePreviewEvents(events: AppEvent[], previewEvents: AppEvent[]) {
  return mergePreviewItems(events, previewEvents, minimumPreviewItemCount);
}

export function filterPreviewDiscounts(discounts: Discount[], searchQuery: string) {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("tr");

  if (!normalizedQuery) {
    return discounts;
  }

  return discounts.filter((discount) =>
    [discount.businessName, discount.title, discount.description, discount.code]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("tr")
      .includes(normalizedQuery),
  );
}

function mergePreviewItems<T extends { id: string }>(
  primaryItems: T[],
  previewItems: T[],
  minimumItemCount: number,
) {
  const merged = dedupeById(primaryItems);

  if (merged.length >= minimumItemCount) {
    return merged;
  }

  previewItems.forEach((item) => {
    if (merged.length >= minimumItemCount) {
      return;
    }

    if (!merged.some((currentItem) => currentItem.id === item.id)) {
      merged.push(item);
    }
  });

  return merged;
}

function dedupeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}
