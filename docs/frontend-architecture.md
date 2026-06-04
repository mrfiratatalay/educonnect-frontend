# EduConnect Frontend — Mimari

## Teknoloji Seçim Gerekçeleri

| Teknoloji | Neden Seçildi |
|-----------|---------------|
| **React 18** | Concurrent features, ecosystem olgunluğu |
| **TypeScript strict** | Runtime hata oranını ciddi ölçüde düşürdü |
| **Vite** | HMR çok hızlı, build süresi kısaldı |
| **Ant Design** | Zengin component kütüphanesi + güçlü tema sistemi (mavi-indigo paletini tek dosyadan yaydık) |
| **TanStack Query** | Server state yönetimi, cache invalidation, optimistic update |
| **Zustand** | Hafif global state — Redux'un boilerplate yükü olmadan |
| **React Router v6** | Nested + layout route desteği |

## Klasör Yapısı

```
src/
├── App.tsx                    # Ana router + layout sarmalayıcı
├── main.tsx                   # Entry point, provider sıralaması
├── pages/                     # Route component'leri (ince, iş mantığını feature'lara delege eder)
├── features/                  # Feature-based modüller
│   ├── auth/                  # Login/Register akışı
│   ├── chat/                  # EduAI chatbot
│   ├── posts/                 # Feed, gönderi CRUD
│   ├── messages/              # SignalR mesajlaşma
│   ├── notifications/         # Bildirim listesi
│   ├── products/              # Marketplace
│   ├── visualsearch/          # Görsel arama
│   ├── groups/                # Topluluklar
│   ├── events/                # Etkinlikler
│   ├── explore/               # Keşfet
│   ├── discounts/             # İndirimler
│   └── users/                 # Profil, takip
├── components/                # Paylaşılan UI parçaları (buton, kart, modal vb.)
├── store/                     # Zustand store'ları (auth, theme, notification count)
├── lib/                       # axios instance, yardımcı fonksiyonlar
├── theme/                     # Ant Design tema override (renk, tipografi, spacing)
└── types/                     # Paylaşılan TypeScript tipleri
```

## Feature Modülü Yapısı

Her feature klasörü aynı iç yapıyı izler:

```
features/posts/
├── api.ts         # Ham axios çağrıları (URL, method, tipler)
├── hooks.ts       # useQuery / useMutation wrapper'ları
├── components/    # Bu feature'a özel React component'leri
└── types.ts       # Feature'a özel TypeScript tipleri
```

## State Mimarisi

```
┌─────────────────────────────────────┐
│  Server State (TanStack Query)      │  ← API verileri, cache, refetch
│  Global State (Zustand)             │  ← auth user, unread count, theme
│  Local State (useState/useReducer)  │  ← form, modal, UI toggling
└─────────────────────────────────────┘
```

## JWT + Refresh Token Akışı

`src/lib/api.ts` axios instance:

1. Her isteğe `Authorization: Bearer <token>` ekler (Zustand auth store'undan)
2. 401 alırsa `POST /api/auth/refresh` çağırır
3. Yeni token ile başarısız isteği tekrarlar
4. Refresh da başarısız olursa `/login`'e yönlendirir

## SignalR Bağlantısı

`src/features/messages/signalr.ts`:

- Login sonrası `/hubs/messages` endpoint'ine bağlanır
- `ReceiveMessage` event → Zustand store güncellenir → UI anında render
- Bağlantı kopunca otomatik reconnect (exponential backoff)

## Routing

```
/                  → Feed (korumalı)
/login             → Login
/register          → Kayıt
/verify-email      → E-posta doğrulama
/profile/:id       → Kullanıcı profili
/communities       → Topluluklar
/explore           → Keşfet
/messages          → Mesajlaşma
/notifications     → Bildirimler
/marketplace       → Pazaryeri
/eduai             → EduAI Chatbot
/bookmarks         → Kaydedilenler
/settings          → Ayarlar
```

Korumalı route'lar `PrivateRoute` wrapper'ı ile sarılmış — token yoksa `/login`'e yönlendirir.
