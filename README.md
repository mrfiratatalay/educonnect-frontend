# EduConnect — Frontend

> Üniversite öğrencileri için yapay zekâ destekli sosyal medya platformunun React + TypeScript arayüzü.

Bu repo, EduConnect projesinin **kullanıcı arayüzünü** içerir. TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri kapsamında, Recep Tayyip Erdoğan Üniversitesi Bilgisayar Mühendisliği bitirme tezi olarak **Fırat Atalay** ve **Ayşe Mandıralı** olarak ikimiz birlikte geliştirdik.

Backend ve AI servisleri için: 👉 [educonnect-backend](https://github.com/mrfiratatalay/educonnect-backend)

---

## 🌍 Canlı Demo

| Bileşen | Adres |
|---|---|
| 🎨 Frontend (canlı) | **https://educonnect-tez.vercel.app** |
| ⚙️ Backend API | https://educonnect-backend-qr03.onrender.com |
| 📖 Swagger | https://educonnect-backend-qr03.onrender.com/swagger |

> ⚠️ Backend Render free tier'da olduğu için 15 dakika boş kaldıktan sonra ilk istekte 30-60 saniye "uyanma süresi" var. İlk login sonrasında her şey hızlı.

---

## 🎯 Bu Frontend Ne İşe Yarar?

Backend'in sunduğu 80+ REST endpoint'ini, **öğrencinin gerçekten kullanmak isteyeceği akıcı bir arayüz** haline getirmek için tasarladık. Hedef kullanıcı: lisans öğrencisi. Hedefimiz: kullanıcı uygulamayı açtığında "bu Instagram + Slack + Sahibinden.com + ChatGPT'nin üniversite versiyonu" hissini versin, ama hiçbirini açıkça taklit etmesin — kendine özgü, **akademik bağlamı vurgulayan** bir kimliği olsun.

Mobile-first responsive tasarım yaptık çünkü öğrenciler bilgisayardan çok telefondan giriyor. Ant Design'ı seçtik çünkü zengin component kütüphanesi var ve **tema customization'ı çok güçlü** — markamızı (mavi-indigo paleti) tek bir tema dosyasından tüm sisteme yaydık.

---

## 🧩 Sayfalar / Özellikler

| Sayfa | Açıklama |
|---|---|
| **Login / Register / Verify Email / Forgot Password** | Kurumsal e-posta zorunluluğu, 6 haneli kod ile doğrulama, JWT tabanlı session yönetimi |
| **Feed (Anasayfa)** | Takip ettiğin kullanıcı ve toplulukların gönderileri, sonsuz scroll, beğeni / yorum / bookmark, görüntülenme sayısı |
| **Profil** | Kendi profilim + diğer kullanıcılar; bölüm, sınıf, biyografi, avatar, kapak görseli, takipçi/takip edilen, kendi gönderi sekmesi, kaydedilenler |
| **Communities (Topluluklar)** | Topluluk listesi, detay sayfası, üyelik, topluluk-içi gönderiler, rol bazlı yönetim |
| **Explore (Keşfet)** | Popüler etiketler, trend gönderiler, etkinlik takvimi, etiket bazlı filtreleme |
| **Messages** | SignalR ile gerçek zamanlı birebir mesajlaşma, konuşma listesi, okundu bilgisi |
| **Notifications** | Yeni takipçi, beğeni, yorum, etkinlik daveti gibi olaylar; her bildirimden ilgili sayfaya derin link |
| **Marketplace (Market)** | İkinci el ürün ilanları, kategori filtresi, fiyat aralığı, **görselden benzer ürün arama** (Visual Search) |
| **EduAI** | RTEU hakkında doğal dilde soru sorabildiğin chat sayfası. Cevabın güven skoru, kaynak URL'i, alt-confidence band'leri kullanıcıya gösteriliyor. Cevap kalitesi için 👍/👎 feedback |
| **Bookmarks** | Daha sonra okumak için kaydettiğin gönderiler |
| **Settings** | Profil bilgisi, şifre değiştirme, bildirim tercihleri |
| **Legal** | Gizlilik politikası ve KVKK aydınlatma metni placeholder'ları |

---

## 🛠️ Teknoloji Yığını

### Çekirdek
- **React 18** — Concurrent features ve transitions için
- **TypeScript** — Strict mode, çok daha az runtime bug
- **Vite** — Bundling ve dev server (HMR çok hızlı)

### UI & Tasarım
- **Ant Design** — Zengin component library, tema customization
- **Lucide React** — Modern, hafif ikonlar
- **CSS-in-TS** — Theme provider üzerinden dinamik tema değişimi (light/dark planlı)

### State & Data
- **Zustand** — Global state (auth, theme, notification count)
- **TanStack Query (React Query)** — Server state yönetimi, cache, optimistic updates
- **React Hook Form + Zod** — Form yönetimi + validation şeması

### Routing & API
- **React Router v6** — Nested routes, layout routes, protected routes
- **Axios** — HTTP client, JWT interceptor, otomatik refresh token rotation
- **@microsoft/signalr** — Backend SignalR Hub'ı ile gerçek zamanlı mesajlaşma

### İçerik & Görselleştirme
- **react-markdown + remark-gfm** — EduAI cevaplarındaki Markdown render'ı
- **recharts** — Analitik grafikler (admin paneli için planlı)

---

## 📂 Proje Yapısı

```
frontend/
├── src/
│   ├── App.tsx                    # Ana router + layout
│   ├── main.tsx                   # Entry point, providers
│   ├── pages/                     # Route component'leri (Feed, Profile, ...)
│   ├── features/                  # Feature-based modüller
│   │   ├── auth/                  # Login/Register API + hooks
│   │   ├── chat/                  # EduAI chatbot API + UI
│   │   ├── posts/                 # Post CRUD, beğeni, yorum
│   │   ├── messages/              # SignalR client, conversation state
│   │   ├── notifications/
│   │   ├── products/              # Marketplace
│   │   ├── visualsearch/          # Görsel yükle, benzer ürünler
│   │   ├── groups/
│   │   ├── events/
│   │   ├── explore/
│   │   ├── discounts/
│   │   └── users/
│   ├── components/                # Paylaşılan UI component'leri
│   ├── store/                     # Zustand store'ları
│   ├── lib/                       # axios instance, helper'lar
│   ├── theme/                     # Ant Design theme override
│   └── types/                     # Paylaşılan TypeScript tipleri
├── public/                        # Statik dosyalar (logo, favicon)
├── index.html
├── vite.config.ts
└── tsconfig.json
```

**Feature-based mimari** seçtik çünkü 11 modüllü bir projede `components/` ve `pages/` klasörleri çok kalabalıklaşıyor. Her feature kendi API call'larını, hook'larını, component'lerini ve type'larını kendi klasöründe tutuyor — yeni feature eklemek bir klasör açmak kadar kolay.

---

## 🚀 Lokal Kurulum

### Önkoşullar
- Node.js 20+
- npm (Node.js ile gelir)
- Çalışan bir backend (lokalde `http://localhost:5160` ya da uzaktan Render URL'i)

### Kurulum

```bash
# Repo'yu klonla
git clone https://github.com/mrfiratatalay/TEZ-Frontend.git
cd TEZ-Frontend

# Bağımlılıkları yükle
npm install

# .env.local dosyası oluştur, backend URL'ini ekle
echo "VITE_API_BASE_URL=http://localhost:5160" > .env.local

# Dev server'ı başlat
npm run dev
```

Tarayıcıda: http://localhost:5173

> Backend'in lokalde Docker ile ayağa kalkması için ana monorepo'daki `scripts\dev\start-docker.bat` kullanılabilir.

### Production Build

```bash
npm run build      # dist/ klasörüne build üretir
npm run preview    # üretilmiş build'i lokalde test et
```

---

## 🌐 Production Deployment (Vercel)

Frontend, **Vercel**'de host ediliyor. Vercel'i seçmemin nedenleri:

- **Vite + React** projeleri için sıfır konfigürasyon
- Her GitHub push'unda otomatik build + deploy
- Branch bazlı **preview deployment'ları** (her PR için ayrı URL)
- Global CDN, edge caching
- TLS sertifikası, custom domain desteği
- Hobby plan ücretsiz, hobi projeler için fazlasıyla yeterli

### Vercel Çevre Değişkeni

Vercel Dashboard → Project Settings → Environment Variables:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://educonnect-backend-qr03.onrender.com` |

(Lokal geliştirmede aynı değişkeni `.env.local` dosyasında set ediyoruz.)

### Otomatik Deploy

`main` branch'e her push → Vercel otomatik build (~1-2 dakika) → canlı URL güncelleniyor. Diğer branch'lere push → preview deployment (örn. `educonnect-tez-git-feature-x.vercel.app`).

---

## 🔌 Backend Entegrasyonu

### Axios Instance + JWT

`src/lib/api.ts` altında merkezi axios instance var:
- Her isteğe otomatik `Authorization: Bearer <token>` header'ı ekliyor (token Zustand auth store'undan)
- 401 cevabı alırsa refresh token ile otomatik token yenileme yapıyor
- Yenileme de başarısızsa kullanıcıyı login sayfasına yönlendiriyor

### SignalR Connection

`src/features/messages/signalr.ts`:
- Kullanıcı login olduğunda backend'in `/hubs/messages` SignalR endpoint'ine bağlanıyor
- Yeni mesaj geldiğinde Zustand store'u güncelliyor, UI anında yansıyor
- Bağlantı kesilirse otomatik reconnect

### TanStack Query Pattern

Her feature'da bir `api.ts` (raw axios çağrıları) ve bir `hooks.ts` (`useQuery`/`useMutation` wrapper'ları). Cache invalidation key'leri merkezi olarak tanımlı. Optimistic update kullanıyoruz beğeni/bookmark gibi hızlı geri bildirim gereken yerlerde.

---

## 🎨 Tasarım Felsefesi

- **Mobile-first**: Tüm sayfalar önce telefon ekranı için tasarlandı, sonra tablet/desktop'a genişletildi
- **Erişilebilirlik**: ARIA label'ları, keyboard navigation, semantik HTML
- **Performance**: Code splitting (route bazlı), lazy loading (görüntüler ve modal'lar), bundle size optimizasyonu
- **Tutarlılık**: Tüm uygulamada aynı spacing scale (8px grid), aynı renk paleti, aynı tipografi hierarşisi

---

## 🧪 Test Edebileceğiniz Hesap

Hızlı demo için seed edilmiş admin hesabıyla giriş yapabilirsiniz:

```
Email:    admin@educonnect.local
Şifre:    Admin123!
```

Gerçek bir kullanıcı yaratmak isterseniz Register sayfasından kayıt olabilirsiniz; doğrulama kodu kayıt ettiğiniz e-postaya gelir.

---

## ⚠️ Bilinen Kısıtlar

- Backend Render free tier'da olduğu için ilk istek "cold start" yaşar (~30-60sn). Bu sırada loading spinner'ı kullanıcıyı bekletiyor.
- Görsel upload'ları backend container'ının ephemeral filesystem'inde duruyor. Container restart'ta upload edilen avatar/post resimleri kaybolur. Demo için yeterli; uzun vadede Cloudinary entegrasyonu planlı.
- Çoklu dil desteği (i18n) şu an için yok — tüm metinler Türkçe. İngilizce çeviri için altyapı hazır (`react-i18next` planlı).

---

## 🛤️ Geliştirme Yol Haritası

- [ ] Dark mode
- [ ] PWA desteği (offline-first, push notifications)
- [ ] Çoklu dil (i18n) — TR/EN
- [ ] Storybook entegrasyonu (component katalogu)
- [ ] Vitest ile unit test coverage
- [ ] Playwright ile end-to-end test
- [ ] Lighthouse skor optimizasyonu (özellikle LCP ve CLS)
- [ ] Markdown editör desteği gönderiler için
- [ ] Skeleton loader'lar daha pürüzsüz UX için

---

## 📚 Kullanılan Açık Kaynak Kütüphaneler

- React, TypeScript, Vite (Meta + Microsoft + Evan You)
- Ant Design (Alibaba)
- TanStack Query, React Hook Form (TanStack + react-hook-form maintainer'ları)
- Zustand (poimandres)
- Lucide Icons
- SignalR JS client (Microsoft)

---

## 👥 Geliştiriciler

Bu proje, Recep Tayyip Erdoğan Üniversitesi Bilgisayar Mühendisliği bölümünde yakın iki arkadaş olarak birlikte geliştirildi:

- **Fırat Atalay** — Bilgisayar Mühendisliği Lisans Öğrencisi, RTEU
- **Ayşe Mandıralı** — Bilgisayar Mühendisliği Lisans Öğrencisi, RTEU

Tüm tasarım kararları, mimari seçimler, kod yazımı ve deploy süreci ikimizin ortak çalışmasının ürünüdür.

TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri Programı bitirme tezi olarak geliştirildi.

---

## 📁 Ek Dokümantasyon

Detaylı teknik belgeler için `docs/` klasörüne bakın:

| Doküman | İçerik |
|---------|--------|
| [docs/frontend-architecture.md](docs/frontend-architecture.md) | Teknoloji seçim gerekçeleri, klasör yapısı, state mimarisi |
| [docs/component-guide.md](docs/component-guide.md) | Bileşen kuralları, TanStack Query örüntüleri, form yönetimi |

---

## 📄 Lisans

MIT License. Akademik ve eğitim amaçlı her kullanım serbesttir; ticari kullanım öncesi lütfen iletişime geçin.
