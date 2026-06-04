# EduConnect Frontend — Bileşen Rehberi

## Paylaşılan Component'ler (`src/components/`)

Tüm sayfalarda ortak kullanılan, feature'a bağlı olmayan parçalar burada.

### Kullanım Kuralları

- Bir component iki veya daha fazla feature'da kullanılıyorsa `components/` altına taşınır
- Feature'a özgü UI `features/<name>/components/` içinde kalır
- Her component TypeScript ile tiplit props alır, `any` kullanılmaz

## Ant Design Tema Sistemi

`src/theme/index.ts` dosyasındaki token override'lar tüm uygulamaya yansır:

```ts
token: {
  colorPrimary: '#4F6EF7',   // İndigo-mavi
  borderRadius: 8,
  fontFamily: '...',
}
```

Bileşen özelleştirmeleri için `components` key'i kullanılır (örn. Button, Card, Input).  
Doğrudan CSS yazmak yerine token kullanmak tema tutarlılığını korur.

## TanStack Query Kuralları

### Query Key Yapısı

```ts
// features/posts/hooks.ts
const QUERY_KEYS = {
  feed: ['posts', 'feed'] as const,
  detail: (id: string) => ['posts', id] as const,
  comments: (postId: string) => ['posts', postId, 'comments'] as const,
}
```

Merkezi key tanımı sayesinde invalidation tutarlı çalışır.

### Optimistic Update Örüntüsü

Beğeni ve bookmark gibi hızlı geri bildirim gerektiren işlemlerde:

1. `onMutate` → UI'ı hemen güncelle, eski state'i kaydet
2. `onError` → Eski state'e geri dön
3. `onSettled` → Query'yi invalidate et (sunucu durumunu al)

## Form Yönetimi

React Hook Form + Zod kombinasyonu:

```ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(schema),
})
```

Validation şeması `types.ts` içinde tanımlanır, hem form hem API tipi paylaşır.

## Performans

- **Code splitting**: Her route lazy import edilir (`React.lazy` + `Suspense`)
- **Görsel lazy loading**: `loading="lazy"` attribute, IntersectionObserver ile
- **Bundle analizi**: `npm run build -- --report` ile chunk boyutları incelenir
- **Memoization**: Sadece profil ederken gerçekten gerekli olduğunda `useMemo`/`useCallback`

## Mobile-First Breakpoint'ler

Ant Design grid sistemi (24 kolonlu) kullanılır:

| Breakpoint | Genişlik |
|------------|----------|
| xs (default) | < 576px — mobil |
| sm | ≥ 576px |
| md | ≥ 768px — tablet |
| lg | ≥ 992px — laptop |
| xl | ≥ 1200px — masaüstü |
