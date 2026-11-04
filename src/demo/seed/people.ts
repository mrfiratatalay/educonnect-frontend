import { AVATAR_COLORS, avatarArt, coverArt } from "@/demo/art";
import { isoAgo } from "@/demo/time";
import type { DemoCategory, DemoFollow, DemoUniversity, DemoUser, DemoUserRole } from "@/demo/types";

/** SHA-256 of DEMO_PASSWORD; the demo login hashes the typed password the same way. */
export const DEMO_PASSWORD_HASH = "7dbb7f051b44d7d54584a7bc6c32f00da5a3b5e6973485b9fb176fe56346b3e3";

export const universities: DemoUniversity[] = [
  { id: "uni-rteu", name: "Recep Tayyip Erdoğan Üniversitesi", city: "Rize", domain: "erdogan.edu.tr" },
  { id: "uni-ktu", name: "Karadeniz Teknik Üniversitesi", city: "Trabzon", domain: "ktu.edu.tr" },
];

export const categories: DemoCategory[] = [
  { id: "cat-books", name: "Ders Kitapları" },
  { id: "cat-electronics", name: "Elektronik" },
  { id: "cat-stationery", name: "Kırtasiye" },
  { id: "cat-tickets", name: "Etkinlik Biletleri" },
];

const COVERS: Array<[string, string]> = [
  ["#14B8A6", "#0F766E"], ["#38BDF8", "#1D4ED8"], ["#A78BFA", "#6D28D9"],
  ["#FDBA74", "#C2410C"], ["#86EFAC", "#15803D"], ["#F9A8D4", "#BE185D"],
];

interface PersonSpec {
  id: string;
  name: string;
  slug: string;
  department: string;
  year: number;
  bio?: string;
  role?: DemoUserRole;
  universityId?: string;
  joinedDaysAgo: number;
}

const people: PersonSpec[] = [
  {
    id: "u-zeynep", name: "Zeynep Kaya", slug: "zeynep.kaya", department: "Bilgisayar Mühendisliği", year: 3,
    bio: "Backend ve yapay zekâ meraklısı. RTEÜ Yazılım Topluluğu kurucusu. Hackathon'larda takım arkadaşı arıyorsan yaz.",
    joinedDaysAgo: 420,
  },
  { id: "u-emre", name: "Emre Yıldız", slug: "emre.yildiz", department: "Elektrik-Elektronik Mühendisliği", year: 1, joinedDaysAgo: 0 },
  {
    id: "u-elif", name: "Elif Demir", slug: "elif.demir", department: "Psikoloji", year: 4, role: "moderator",
    bio: "Psikoloji 4. sınıf. EduConnect gönüllü moderatörü; topluluk kurallarına göz kulak oluyorum. Kitap Kulübü'ndeyim.",
    joinedDaysAgo: 400,
  },
  {
    id: "u-mert", name: "Mert Aksoy", slug: "mert.aksoy", department: "Bilgisayar Mühendisliği", year: 4, role: "admin",
    bio: "EduConnect platform yöneticisi. Duyurular ve platform güncellemeleri benden.", joinedDaysAgo: 430,
  },
  {
    id: "u-burak", name: "Burak Şahin", slug: "burak.sahin", department: "Elektrik-Elektronik Mühendisliği", year: 4,
    bio: "Gömülü sistemler, IoT ve biraz da elektronik müzik. Yazılım Topluluğu moderatörü.", joinedDaysAgo: 390,
  },
  {
    id: "u-selin", name: "Selin Koç", slug: "selin.koc", department: "İşletme", year: 3,
    bio: "Kariyer ve Staj Kulübü başkanı. Staj, CV ve mülakat sorularınıza açığım.", joinedDaysAgo: 360,
  },
  {
    id: "u-can", name: "Can Öztürk", slug: "can.ozturk", department: "Mimarlık", year: 3,
    bio: "Mimarlık öğrencisi, Fotoğrafçılık Topluluğu kurucusu. Rize'nin yağmurunu fotoğraflıyorum.", joinedDaysAgo: 350,
  },
  {
    id: "u-ahmet", name: "Ahmet Çelik", slug: "ahmet.celik", department: "Makine Mühendisliği", year: 4,
    bio: "Doğa Sporları Kulübü. Hafta sonları Kaçkarlar'dayım.", joinedDaysAgo: 380,
  },
  {
    id: "u-merve", name: "Merve Aydın", slug: "merve.aydin", department: "Türk Dili ve Edebiyatı", year: 2,
    bio: "Kitap Kulübü'nü yönetiyorum. Her ay bir kitap, her perşembe bir sohbet.", joinedDaysAgo: 300,
  },
  {
    id: "u-deniz", name: "Deniz Arslan", slug: "deniz.arslan", department: "İktisat", year: 2,
    bio: "Girişimcilik Kulübü. Kooperatifler ve bölgesel kalkınma üzerine çalışıyorum.", joinedDaysAgo: 280,
  },
  {
    id: "u-fatma", name: "Fatma Yılmaz", slug: "fatma.yilmaz", department: "Tıp", year: 2,
    bio: "Tıp Bilim Topluluğu. Kan bağışı kampanyalarını organize ediyoruz.", joinedDaysAgo: 260,
  },
  { id: "u-kerem", name: "Kerem Doğan", slug: "kerem.dogan", department: "İnşaat Mühendisliği", year: 2, joinedDaysAgo: 240 },
  { id: "u-ece", name: "Ece Yıldırım", slug: "ece.yildirim", department: "Diş Hekimliği", year: 1, joinedDaysAgo: 50 },
  {
    id: "u-onur", name: "Onur Polat", slug: "onur.polat", department: "Bilgisayar Mühendisliği", year: 4,
    universityId: "uni-ktu", bio: "KTÜ Bilgisayar Mühendisliği. Algoritma yarışmaları ve açık kaynak.", joinedDaysAgo: 200,
  },
  {
    id: "u-nazli", name: "Nazlı Erdem", slug: "nazli.erdem", department: "Turizm İşletmeciliği", year: 2,
    bio: "Turizm öğrencisi, Ayder'de gönüllü rehber.", joinedDaysAgo: 220,
  },
  {
    id: "u-baris", name: "Barış Kılıç", slug: "baris.kilic", department: "Bilgisayar Mühendisliği", year: 2,
    bio: "Frontend ve algoritmalar. İlk açık kaynak katkım kabul edildi!", joinedDaysAgo: 310,
  },
];

export function createUsers(): DemoUser[] {
  return people.map((person, index) => {
    const domain = person.universityId === "uni-ktu" ? "demo.ktu.edu.tr" : "demo.erdogan.edu.tr";
    const [from, to] = COVERS[index % COVERS.length];
    const isNewcomer = person.id === "u-emre";
    return {
      id: person.id,
      fullName: person.name,
      email: `${person.slug}@${domain}`,
      passwordHash: DEMO_PASSWORD_HASH,
      role: person.role ?? "student",
      universityId: person.universityId ?? "uni-rteu",
      department: person.department,
      year: person.year,
      bio: person.bio,
      avatarUrl: isNewcomer ? undefined : avatarArt(person.name, AVATAR_COLORS[index % AVATAR_COLORS.length]),
      coverImageUrl: isNewcomer ? undefined : coverArt(from, to),
      isActive: true,
      emailVerified: true,
      createdAtUtc: isNewcomer ? isoAgo({ minutes: 20 }) : isoAgo({ days: person.joinedDaysAgo }),
    };
  });
}

const followMap: Record<string, string[]> = {
  "u-zeynep": ["u-burak", "u-selin", "u-can", "u-ahmet", "u-merve", "u-baris", "u-onur", "u-elif"],
  "u-elif": ["u-merve", "u-fatma", "u-zeynep", "u-nazli"],
  "u-mert": ["u-zeynep", "u-burak", "u-selin", "u-deniz"],
  "u-burak": ["u-zeynep", "u-baris", "u-onur", "u-kerem", "u-mert"],
  "u-selin": ["u-zeynep", "u-deniz", "u-nazli", "u-can"],
  "u-can": ["u-zeynep", "u-nazli", "u-merve", "u-ece"],
  "u-ahmet": ["u-kerem", "u-fatma", "u-onur", "u-can"],
  "u-merve": ["u-elif", "u-can", "u-nazli"],
  "u-deniz": ["u-zeynep", "u-selin", "u-mert"],
  "u-fatma": ["u-zeynep", "u-ece", "u-elif", "u-ahmet"],
  "u-kerem": ["u-zeynep", "u-ahmet", "u-baris"],
  "u-ece": ["u-zeynep", "u-fatma", "u-can"],
  "u-onur": ["u-zeynep", "u-burak", "u-baris"],
  "u-nazli": ["u-zeynep", "u-selin", "u-can", "u-merve"],
  "u-baris": ["u-zeynep", "u-burak", "u-onur", "u-kerem"],
};

export function createFollows(): DemoFollow[] {
  return Object.entries(followMap).flatMap(([followerId, followedIds], index) =>
    followedIds.map((followedId, offset) => ({
      followerId,
      followedId,
      createdAtUtc: isoAgo({ days: 40 + index * 3 + offset }),
    })),
  );
}
