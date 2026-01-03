# Shared Directory

Bu dizin, uygulamanın tüm feature'ları tarafından kullanılan paylaşılan kaynakları içerir.

## Yapı

```
shared/
  components/     # Paylaşılan UI component'leri
  hooks/          # Paylaşılan React hook'ları
  constants/      # Paylaşılan sabitler
  types/          # Paylaşılan TypeScript tipleri (eklenebilir)
  utils/          # Paylaşılan utility fonksiyonları (eklenebilir)
```

## Kullanım

Shared kaynaklar `@/shared/` path alias'ı ile import edilir:

```typescript
import { ThemedText } from '@/shared/components/themed-text';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Colors } from '@/shared/constants/theme';
```

## Kurallar

- Sadece birden fazla feature tarafından kullanılan kodlar burada olmalıdır
- Feature'a özel kodlar ilgili feature dizininde olmalıdır
- Yeni bir shared kaynak eklerken, en az 2 feature tarafından kullanılacağından emin olun

