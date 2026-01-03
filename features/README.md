# Features Directory

Bu dizin, uygulamanın feature-based yapısını içerir. Her feature kendi dizininde organize edilmiştir.

## Feature Yapısı

Her feature aşağıdaki alt dizinleri içerebilir:

```
features/
  <feature-name>/
    screens/        # Feature'a özel ekranlar
    components/     # Feature'a özel component'ler
    hooks/          # Feature'a özel hook'lar
    types/          # Feature'a özel TypeScript tipleri
    utils/          # Feature'a özel utility fonksiyonları
    constants/      # Feature'a özel sabitler (isteğe bağlı)
```

## Mevcut Features

### home
Ana sayfa feature'ı. HomeScreen burada bulunur.

### explore
Keşfet sayfası feature'ı. ExploreScreen burada bulunur.

## Shared Resources

Tüm feature'lar tarafından kullanılan paylaşılan kaynaklar `shared/` dizininde bulunur:

- `shared/components/` - Paylaşılan UI component'leri
- `shared/hooks/` - Paylaşılan hook'lar
- `shared/constants/` - Paylaşılan sabitler
- `shared/types/` - Paylaşılan TypeScript tipleri (eklenebilir)
- `shared/utils/` - Paylaşılan utility fonksiyonları (eklenebilir)

