/** Accounts behind the one-click login cards. They log in through the normal login API. */

export const DEMO_PASSWORD = "Demo1234!";

export interface DemoPersona {
  userId: string;
  email: string;
  name: string;
  role: string;
  summary: string;
  highlights: string[];
  color: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    userId: "u-zeynep",
    email: "zeynep.kaya@demo.erdogan.edu.tr",
    name: "Zeynep Kaya",
    role: "Deneyimli öğrenci",
    summary:
      "Bilgisayar Mühendisliği 3. sınıf. Akışı, mesajları ve EduAI geçmişi dolu. Yazılım Topluluğu'nun kurucusu olarak üyeleri yönetebilir.",
    highlights: ["Kişisel akış", "Topluluk sahibi", "Mesajlar"],
    color: "#0F766E",
  },
  {
    userId: "u-emre",
    email: "emre.yildiz@demo.erdogan.edu.tr",
    name: "Emre Yıldız",
    role: "Yeni öğrenci",
    summary:
      "Elektrik-Elektronik Mühendisliği 1. sınıf, platforma yeni katıldı. Kimseyi takip etmiyor; topluluk keşfi ve takip önerileriyle başlar.",
    highlights: ["İlk deneyim", "Öneriler", "Keşfet"],
    color: "#0369A1",
  },
  {
    userId: "u-elif",
    email: "elif.demir@demo.erdogan.edu.tr",
    name: "Elif Demir",
    role: "Moderatör",
    summary:
      "Platform moderatörü. Kurallara aykırı gönderi, yorum ve etkinlikleri sahibi kim olursa olsun kaldırabilir.",
    highlights: ["Gönderi silme", "Yorum silme", "Etkinlik yönetimi"],
    color: "#7C3AED",
  },
  {
    userId: "u-mert",
    email: "mert.aksoy@demo.erdogan.edu.tr",
    name: "Mert Aksoy",
    role: "Yönetici",
    summary:
      "Platform yöneticisi. Arayüzde moderatörle aynı yetkilere sahip; indirim ekleme ve EduAI analitiği şimdilik yalnızca API'de.",
    highlights: ["Tüm moderasyon", "Duyurular"],
    color: "#BE185D",
  },
];
