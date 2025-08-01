# 🍽️ Vizodex - Dijital Menü Sistemi

Modern restoran ve kafeler için QR kod tabanlı dijital menü çözümü. Next.js 14, TypeScript ve TailwindCSS ile geliştirilmiştir.

## ✨ Özellikler

### 🎯 Temel Özellikler
- **QR Kod Entegrasyonu**: Her restoran için benzersiz QR kodları
- **Mobil Öncelikli Tasarım**: Mobil cihazlar için optimize edilmiş
- **Karanlık/Aydınlık Mod**: Tema değiştirme desteği
- **Güvenli Admin Panel**: NextAuth.js ile kimlik doğrulama
- **Çok Dilli Destek**: Türkçe ve İngilizce
- **PWA Desteği**: Offline çalışma ve uygulama gibi deneyim

### 🎨 Kullanıcı Arayüzü
- **Modern Tasarım**: Framer Motion animasyonları
- **Responsive Layout**: Tüm cihazlarda mükemmel görünüm
- **Özelleştirilebilir Temalar**: Restoran markasına uygun renkler
- **Hızlı Yükleme**: Optimize edilmiş performans

### 🔧 Admin Paneli
- **Restoran Yönetimi**: Kolay restoran ekleme ve düzenleme
- **Kategori Sistemi**: Menü kategorilerini organize etme
- **Ürün Yönetimi**: Menü öğelerini ekleme, düzenleme, silme
- **QR Kod Oluşturucu**: Özelleştirilebilir QR kodları
- **Resim Yükleme**: Ürün ve logo görselleri
- **İstatistikler**: Görüntüleme ve kullanım analitikleri

### 🍽️ Menü Özellikleri
- **Kategori Filtreleme**: Kolay navigasyon
- **Arama Fonksiyonu**: Hızlı ürün bulma
- **Ürün Detayları**: Malzemeler, besin değerleri, alerjik uyarılar
- **Fiyat Gösterimi**: Çoklu para birimi desteği
- **Özel Etiketler**: Vejetaryen, vegan, glutensiz, yeni, popüler
- **Baharatlı Seviye**: Görsel acılık göstergesi

## 🛠️ Teknoloji Yığını

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **NextAuth.js**: Authentication solution
- **QR Code Generation**: Custom QR code library

### UI/UX
- **Lucide Icons**: Beautiful icon set
- **React Hot Toast**: Notification system
- **Custom Design System**: Consistent styling
- **Dark/Light Mode**: Theme switching

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB veritabanı
- npm veya yarn

### Adım Adım Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/jaN-krk/vizodex-qr-menu.git
cd vizodex-qr-menu
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın:**
```bash
cp .env.example .env.local
```

4. **`.env.local` dosyasını düzenleyin:**
```env
MONGODB_URI=mongodb://localhost:27017/vizodex
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

6. **Tarayıcınızda açın:** [http://localhost:3000](http://localhost:3000)

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel sayfaları
│   │   ├── dashboard/     # Ana dashboard
│   │   ├── login/         # Giriş sayfası
│   │   ├── register/      # Kayıt sayfası
│   │   └── restaurants/   # Restoran yönetimi
│   ├── api/               # API rotaları
│   │   ├── auth/          # Kimlik doğrulama
│   │   ├── restaurants/   # Restoran CRUD
│   │   ├── categories/    # Kategori yönetimi
│   │   ├── menu-items/    # Menü öğeleri
│   │   └── qr-code/       # QR kod oluşturma
│   ├── menu/              # Müşteri menü sayfaları
│   └── globals.css        # Global stiller
├── components/            # React bileşenleri
│   ├── providers/         # Context sağlayıcıları
│   ├── ui/               # UI bileşenleri
│   └── admin/            # Admin panel bileşenleri
├── lib/                  # Yardımcı kütüphaneler
│   ├── models/           # MongoDB modelleri
│   ├── auth.ts           # Kimlik doğrulama yapılandırması
│   ├── mongodb.ts        # Veritabanı bağlantısı
│   ├── qr-code.ts        # QR kod oluşturucu
│   └── utils.ts          # Yardımcı fonksiyonlar
├── types/                # TypeScript tip tanımları
└── middleware.ts         # Next.js middleware
```

## 🎯 Kullanım

### Admin Panel
1. `/admin/register` - Yeni hesap oluşturun
2. `/admin/login` - Giriş yapın
3. `/admin/dashboard` - Ana kontrol paneli
4. Restoran ekleyin ve menünüzü oluşturun
5. QR kodunuzu oluşturun ve yazdırın

### Müşteri Deneyimi
1. QR kodu tarayın veya doğrudan linke gidin
2. Menüyü kategorilere göre inceleyin
3. Ürün detaylarını görüntüleyin
4. Arama yapın ve filtreleyin

## 🔧 Yapılandırma

### Veritabanı Modelleri
- **User**: Kullanıcı hesapları ve roller
- **Restaurant**: Restoran bilgileri ve ayarları
- **Category**: Menü kategorileri
- **MenuItem**: Menü öğeleri ve detayları

### Tema Özelleştirme
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { /* Mavi tonları */ },
      secondary: { /* Sarı tonları */ },
      accent: { /* Pembe tonları */ }
    }
  }
}
```

## 📱 PWA Özellikleri
- Offline çalışma desteği
- Ana ekrana ekleme
- Push bildirimleri (opsiyonel)
- Hızlı yükleme

## 🔒 Güvenlik
- NextAuth.js ile güvenli kimlik doğrulama
- CSRF koruması
- Rate limiting
- Input validation
- XSS koruması

## 🌍 SEO ve Performans
- Server-side rendering
- Otomatik sitemap oluşturma
- Meta tag optimizasyonu
- Image optimization
- Code splitting

## 📊 Analytics (Opsiyonel)
- Google Analytics entegrasyonu
- Menü görüntüleme istatistikleri
- Popüler ürün takibi
- Kullanıcı davranış analizi

## 🚀 Deployment

### Vercel (Önerilen)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t vizodex .
docker run -p 3000:3000 vizodex
```

### Manuel Deployment
```bash
npm run build
npm start
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🆘 Destek

- 📧 Email: destek@vizodex.com
- 🐛 Issues: GitHub Issues
- 📖 Dokümantasyon: [Wiki](https://github.com/jaN-krk/vizodex-qr-menu/wiki)

## 🙏 Teşekkürler

Bu projeyi mümkün kılan tüm açık kaynak kütüphanelere ve katkıda bulunanlara teşekkürler.

---

**Vizodex® - Modern Dijital Menü Çözümleri**

