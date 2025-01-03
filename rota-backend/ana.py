from geopy.geocoders import Nominatim
from shapely.geometry import Point, Polygon, MultiPolygon
import googlemaps
import json
from cities import CITIES
import os
from dotenv import load_dotenv
from route_model import RouteModel
import webbrowser  # En üste import ekleyelim

# .env dosyasını yükle
load_dotenv()

class LocationValidator:
    def __init__(self):
        self.cities_data = None
        self.geolocator = Nominatim(user_agent="rota_optimizer")
        self.gmaps = None
        self.load_geojson()
        self.setup_google_maps()
        self.starting_point = None
        self.delivery_points = []
        self.addresses = []
    
    def setup_google_maps(self):
        # Google Maps API anahtarını çevresel değişkenlerden al
        api_key = os.getenv('GOOGLE_MAPS_API_KEY')
        if api_key:
            self.gmaps = googlemaps.Client(key=api_key)
        else:
            print("Uyarı: Google Maps API anahtarı bulunamadı!")
    
    def load_geojson(self):
        try:
            with open('tr-cities.json', 'r', encoding='utf-8') as f:
                self.cities_data = json.load(f)
            print("Şehir sınır verileri başarıyla yüklendi.")
        except FileNotFoundError:
            print("Uyarı: tr-cities.json dosyası bulunamadı!")
            self.cities_data = None

    def get_coordinates_from_address(self, address):
        if self.gmaps:
            try:
                # Adresi Türkiye'ye özgü hale getir
                if not "türkiye" in address.lower():
                    address = f"{address}, Türkiye"
                
                # Google Maps ile adresi ara
                result = self.gmaps.geocode(address)
                
                if result and len(result) > 0:
                    location = result[0]['geometry']['location']
                    lat = location['lat']
                    lng = location['lng']
                    print(f"\nAdres bulundu: {result[0]['formatted_address']}")
                    return (lat, lng)
                else:
                    print("Adres bulunamadı!")
                    return None
            except Exception as e:
                print(f"Google Maps API hatası: {e}")
                return None
        else:
            print("Google Maps API kullanılamıyor. API anahtarını kontrol edin.")
            return None

    def is_point_in_city(self, lat, lon, city_name):
        if not self.cities_data:
            return False

        city_name_normalized = city_name.replace('ş', 's').replace('ğ', 'g').replace('ı', 'i').replace('ö', 'o').replace('ü', 'u').replace('ç', 'c')
        point = Point(lon, lat)  # GeoJSON lon,lat formatını kullanır
        
        for feature in self.cities_data['features']:
            if feature['properties']['name'].lower() == city_name_normalized.lower():
                geometry = feature['geometry']
                if geometry['type'] == 'Polygon':
                    polygon = Polygon(geometry['coordinates'][0])
                    return polygon.contains(point)
                elif geometry['type'] == 'MultiPolygon':
                    multipolygon = MultiPolygon([Polygon(poly[0]) for poly in geometry['coordinates']])
                    return multipolygon.contains(point)
        return False

    def get_location_input(self, prompt_text, city_name):
        while True:
            print("\nKonum girişi için tercih yapınız:")
            print("1. Adres girmek istiyorum")
            print("2. Koordinat girmek istiyorum")
            
            choice = input("\nSeçiminiz (1 veya 2): ")
            
            if choice == "1":
                address = input(f"\n{prompt_text} (Adres): ")
                coordinates = self.get_coordinates_from_address(address)
                
                if coordinates:
                    lat, lon = coordinates
                    print(f"\nGirilen adresin koordinatları: {lat}, {lon}")
                    self.addresses.append(address)
                else:
                    print("Adres koordinatlara çevrilemedi!")
                    continue
                    
            elif choice == "2":
                try:
                    coord_input = input(f"\n{prompt_text} (Koordinat 'enlem,boylam' formatında, Örnek: 39.759242,30.491559): ")
                    lat_str, lon_str = [x.strip() for x in coord_input.split(',')]
                    lat = float(lat_str)
                    lon = float(lon_str)
                    coordinates = (lat, lon)
                    print(f"\nGirilen koordinatlar: Enlem={lat}, Boylam={lon}")
                    self.addresses.append(f"Koordinat: {lat},{lon}")
                except ValueError:
                    print("Geçersiz koordinat formatı! Lütfen sayıları virgülle ayırarak girin.")
                    print("Örnek format: 39.759242,30.491559")
                    continue
                except Exception as e:
                    print(f"Bir hata oluştu: {e}")
                    print("Lütfen koordinatları doğru formatta girin.")
                    continue
            else:
                print("Geçersiz seçim! Lütfen 1 veya 2 girin.")
                continue
                
            if self.is_point_in_city(coordinates[0], coordinates[1], city_name):
                print(f"\nBaşarılı! Girilen konum {city_name} il sınırları içindedir.")
                return coordinates
            else:
                print(f"\nHata! Girilen konum {city_name} il sınırları dışındadır.")
                print("Lütfen tekrar deneyin.")

def select_city():
    print("\nTürkiye'nin İlleri:")
    print("-" * 30)
    
    for index, city in enumerate(CITIES, 1):
        print(f"{index}. {city}")
    
    while True:
        try:
            choice = int(input("\nLütfen bir şehir numarası seçin (1-81): "))
            if 1 <= choice <= len(CITIES):
                selected_city = CITIES[choice - 1]
                print(f"\nSeçilen şehir: {selected_city}")
                return selected_city
            else:
                print("Hatalı giriş! Lütfen 1 ile 81 arasında bir sayı girin.")
        except ValueError:
            print("Hatalı giriş! Lütfen bir sayı girin.")

def create_google_maps_url(start_point, waypoints):
    """
    Google Maps navigasyon URL'si oluşturur
    """
    base_url = "https://www.google.com/maps/dir/?api=1"
    origin = f"{start_point[0]},{start_point[1]}"
    
    # Son noktayı destination olarak ayarla, diğerlerini waypoint olarak ekle
    if waypoints:
        destination = f"{waypoints[-1][0]},{waypoints[-1][1]}"
        if len(waypoints) > 1:
            # Son nokta hariç diğer noktaları waypoint olarak ekle
            waypoints_str = "|".join([f"{point[0]},{point[1]}" for point in waypoints[:-1]])
            return f"{base_url}&origin={origin}&destination={destination}&waypoints={waypoints_str}&travelmode=driving"
        else:
            return f"{base_url}&origin={origin}&destination={destination}&travelmode=driving"
    return None

def main():
    validator = LocationValidator()
    selected_city = select_city()
    
    # Başlangıç noktasını al
    print("\n--- Başlangıç Noktası Girişi ---")
    starting_point = validator.get_location_input("Lütfen başlangıç noktasını girin", selected_city)
    validator.starting_point = starting_point
    
    # Sipariş sayısını al
    while True:
        try:
            num_orders = int(input("\nKaç adet sipariş noktası gireceksiniz? (Maksimum 10): "))
            if 1 <= num_orders <= 10:
                break
            else:
                print("Lütfen 1 ile 10 arasında bir sayı girin!")
        except ValueError:
            print("Lütfen geçerli bir sayı girin!")
    
    # Sipariş noktalarını al
    print("\n--- Sipariş Noktaları Girişi ---")
    for i in range(num_orders):
        print(f"\n{i+1}. Sipariş Noktası")
        delivery_point = validator.get_location_input(f"Lütfen {i+1}. sipariş noktasını girin", selected_city)
        validator.delivery_points.append(delivery_point)
    
    # RouteModel'i kullanarak rotayı optimize et
    route_model = RouteModel(validator.starting_point)
    
    # Tüm durakları modele ekle
    for i, point in enumerate(validator.delivery_points):
        route_model.add_stop(validator.addresses[i], point)
    
    # Rotayı optimize et
    route_model.optimize_route()
    
    # Sonuçları göster
    print("\nOptimize Edilmiş Rota:")
    print("-" * 50)
    print(f"Başlangıç Noktası: {validator.starting_point}")
    print("\nSipariş Rotası:")
    for i, address in enumerate(route_model.get_optimized_route(), 1):
        print(f"{i}. Durak: {address}")
    
    # Optimize edilmiş rotaya göre koordinatları sırala
    optimized_coordinates = []
    for stop in route_model.route:
        optimized_coordinates.append(stop['coordinates'])
    
    # Google Maps URL'sini oluştur
    maps_url = create_google_maps_url(validator.starting_point, optimized_coordinates)
    
    if maps_url:
        print("\nGoogle Maps'te navigasyonu başlatmak ister misiniz? (E/H)")
        choice = input().strip().lower()
        if choice == 'e':
            print("\nGoogle Maps açılıyor...")
            webbrowser.open(maps_url)
        else:
            print("\nNavigasyon başlatılmadı.")
    else:
        print("\nNavigasyon URL'si oluşturulamadı.")

if __name__ == "__main__":
    main() 