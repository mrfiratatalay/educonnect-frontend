import { isoAgo } from "@/demo/time";
import type { DemoChatSession, DemoConversation, DemoNotification } from "@/demo/types";

type NotificationSpec = [
  id: string, userId: string, title: string, message: string, type: DemoNotification["type"],
  targetPath: string, minutesAgo: number, isRead: boolean,
];

// Only notification kinds the real backend creates: likes, comments, follows, joins, event sign-ups, messages.
const notifications: NotificationSpec[] = [
  ["n-1", "u-zeynep", "Burak Şahin gönderini beğendi", "Hackathon kayıtları açıldı! 3-4 kişilik takımlarla 48 saat boyunca...", "social", "/post/p-12", 12, false],
  ["n-2", "u-zeynep", "Barış Kılıç gönderine yorum yaptı", "Takım arıyorum, frontend tarafında iyiyim!", "social", "/post/p-12", 52, false],
  ["n-3", "u-zeynep", "Onur Polat sana mesaj gönderdi", "Ortak hackathon fikri için KTÜ tarafında iki topluluk hazır.", "social", "/messages", 130, false],
  ["n-4", "u-zeynep", "Deniz Arslan seni takip etmeye başladı", "Profilini ziyaret ederek geri takip edebilirsin.", "social", "/profile/u-deniz", 180, true],
  ["n-5", "u-zeynep", "Selin Koç grubuna katıldı", "RTEÜ Yazılım Topluluğu", "social", "/communities/rteu-yazilim-toplulugu", 300, true],
  ["n-6", "u-zeynep", "Kerem Doğan etkinliğine katıldı", "RTEÜ Hackathon: Kampüs İçin Kod", "event", "/events", 1500, true],
  ["n-7", "u-zeynep", "Nazlı Erdem gönderine yorum yaptı", "3. kat sabah 9'da doluyordu, haklısın.", "social", "/post/p-02", 270, true],
  ["n-8", "u-elif", "Merve Aydın gönderini beğendi", "Okuma listemize önerilerinizi bekliyoruz...", "social", "/post/p-29", 200, false],
  ["n-9", "u-elif", "Merve Aydın gönderine yorum yaptı", "Bence evet, Tutunamayanlar'ı da ekleyelim.", "social", "/post/p-29", 1400, true],
  ["n-10", "u-mert", "Zeynep Kaya gönderini beğendi", "EduConnect güncellemesi: Akışınız artık takip ettikleriniz...", "social", "/post/p-16", 900, false],
  ["n-11", "u-mert", "Deniz Arslan seni takip etmeye başladı", "Profilini ziyaret ederek geri takip edebilirsin.", "social", "/profile/u-deniz", 3000, true],
];

export function createNotifications(): DemoNotification[] {
  return notifications.map(([id, userId, title, message, type, targetPath, minutesAgo, isRead]) => ({
    id, userId, title, message, type, targetPath, isRead, createdAtUtc: isoAgo({ minutes: minutesAgo }),
  }));
}

type MessageSpec = [senderUserId: string, content: string, minutesAgo: number];

function conversation(id: string, a: string, b: string, messages: MessageSpec[]): DemoConversation {
  const [userLowerId, userHigherId] = a < b ? [a, b] : [b, a];
  const items = messages.map(([senderUserId, content, minutesAgo], i) => ({
    id: `${id}-m${i + 1}`, senderUserId, content, sentAtUtc: isoAgo({ minutes: minutesAgo }),
  }));
  return { id, userLowerId, userHigherId, messages: items, lastMessageAtUtc: items[items.length - 1].sentAtUtc };
}

export function createConversations(): DemoConversation[] {
  return [
    conversation("c-1", "u-zeynep", "u-burak", [
      ["u-burak", "Hackathon için mentör listesini çıkardım, üç kişi kesinleşti.", 1570],
      ["u-zeynep", "Süper! Biri yapay zekâ tarafından olursa çok iyi olur.", 1510],
      ["u-burak", "Bilgisayar mühendisliğinden bir hocamız da gelmek istiyor, onu da ekledim.", 40],
      ["u-zeynep", "Harika, duyuru metnine ekleyelim.", 35],
      ["u-burak", "Tamamdır, akşama taslağı gönderiyorum.", 25],
    ]),
    conversation("c-2", "u-zeynep", "u-onur", [
      ["u-onur", "Selam Zeynep, gönderine yazdığın yorumu gördüm.", 185],
      ["u-onur", "Ortak hackathon fikri için KTÜ tarafında iki topluluk hazır. Tarihleri birlikte konuşalım mı?", 130],
    ]),
    conversation("c-3", "u-zeynep", "u-selin", [
      ["u-zeynep", "Kariyer Günleri'nde CV kliniği için gönüllü arıyor muydunuz?", 1810],
      ["u-selin", "Evet! 13.00–15.00 arası yardım edebilirsen harika olur.", 1750],
      ["u-zeynep", "Yazın beni, oradayım.", 1690],
    ]),
    conversation("c-4", "u-elif", "u-merve", [
      ["u-merve", "Perşembe için salon rezervasyonu tamam.", 400],
      ["u-elif", "Teşekkürler, tartışma sorularını ben hazırlarım.", 380],
    ]),
  ];
}

export function createChatSessions(): DemoChatSession[] {
  const started = isoAgo({ days: 2, minutes: 8 });
  const bot = { confidenceBand: "medium" as const, needsReview: false, modelUsed: "demo-keyword+kb", kbHit: true, isFallback: false };
  return [
    {
      id: "cs-1", userId: "u-zeynep", startedAtUtc: started, endedAtUtc: isoAgo({ days: 2 }),
      messages: [
        { id: "cs-1-1", senderType: "user", content: "Bütünleme sınavına kimler girebilir?", timestampUtc: isoAgo({ days: 2, minutes: 7 }) },
        {
          id: "cs-1-2", senderType: "bot", ...bot, intentDetected: "exam_and_grading", confidence: 0.82, latencyMs: 640,
          content: "Finale girme sartini saglayip basarisiz olanlar, finale girmeyenler ve not yukseltmek isteyen DC notlu ogrenciler butunleme sinavina girebilir. Butunleme notu final notunun yerine gecer.\n\nKaynak: https://oidb.erdogan.edu.tr/tr/news-detail/tek-ders-sinavi/6418",
          timestampUtc: isoAgo({ days: 2, minutes: 7 }),
        },
        { id: "cs-1-3", senderType: "user", content: "Kütüphane hangi birim tarafından yönetiliyor?", timestampUtc: isoAgo({ days: 2, minutes: 4 }) },
        {
          id: "cs-1-4", senderType: "bot", ...bot, intentDetected: "library", confidence: 0.81, latencyMs: 590,
          content: "Kutuphane hizmetleri Kutuphane ve Dokumantasyon Daire Baskanligi tarafindan yurutulur.\n\nKaynak: https://kutuphanedb.erdogan.edu.tr/",
          timestampUtc: isoAgo({ days: 2, minutes: 4 }),
        },
      ],
    },
  ];
}
