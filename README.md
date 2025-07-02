# NAVIONIX - Rota Optimizasyonu Uygulaması

## Proje Hakkında

NAVIONIX, Türkiye haritası üzerinde şehir seçimi yaparak, belirlediğiniz teslimat noktaları için en uygun rotayı optimize eden bir web uygulamasıdır. Kullanıcılar, sisteme kayıt olup giriş yaptıktan sonra şehir seçebilir, teslimat noktalarını adres veya koordinat olarak girebilir ve optimize edilmiş rotayı Google Maps üzerinden görüntüleyebilirler.

## Özellikler

- **Kullanıcı Girişi ve Kayıt:** Firebase Authentication ile güvenli giriş ve kayıt.
- **Şehir Seçimi:** Türkiye haritası üzerinden şehir seçimi.
- **Teslimat Noktası Girişi:** Adres veya koordinat ile teslimat noktası ekleme (1-10 arası).
- **Adres Doğrulama:** Girilen adresin/koordinatın seçilen şehir sınırları içinde olup olmadığı kontrol edilir.
- **Rota Optimizasyonu:** Girilen teslimat noktaları için en kısa yolun hesaplanması.
- **Google Maps ile Navigasyon:** Optimize edilen rota, Google Maps üzerinde açılabilir.

## Kurulum

### 1. Backend (Flask)

#### Gereksinimler

- Python 3.8+
- `rota-backend/requirements.txt` dosyasındaki kütüphaneler:
  - flask
  - flask-cors
  - geopy
  - shapely
  - googlemaps
  - python-dotenv
  - gunicorn

#### Kurulum Adımları

```bash
cd rota-backend
python -m venv venv
venv\Scripts\activate  # Windows için
pip install -r requirements.txt
python app.py
```

Varsayılan olarak backend `localhost:5000` veya `localhost:8000` portunda çalışır.

### 2. Frontend (React)

#### Gereksinimler

- Node.js 18.x

#### Kurulum Adımları

```bash
cd client
npm install
npm start
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Kullanım

1. **Kayıt Olun / Giriş Yapın:** Ana ekranda kullanıcı kaydı oluşturabilir veya mevcut hesabınızla giriş yapabilirsiniz.
2. **Şehir Seçin:** Harita üzerinden teslimat yapılacak şehri seçin.
3. **Başlangıç Noktası ve Teslimat Noktalarını Girin:** Adres veya koordinat olarak teslimat noktalarını ekleyin.
4. **Rota Optimizasyonu:** Tüm noktalar girildikten sonra, sistem en kısa rotayı optimize eder.
5. **Navigasyon:** Optimize edilen rotayı Google Maps üzerinde açarak navigasyon başlatabilirsiniz.

## Proje Yapısı

```
Rota opizimasyonu/
  ├── client/           # React tabanlı frontend
  └── rota-backend/     # Flask tabanlı backend
```

## Katkı ve Geliştirme

- Pull request ve issue açarak katkıda bulunabilirsiniz.
- Kodda açıklamalar ve fonksiyon isimleri Türkçe'dir, anlaşılır ve geliştirilebilir yapıdadır.

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır. 
