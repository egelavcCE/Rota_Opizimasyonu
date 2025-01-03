from flask import Flask, request, jsonify
from flask_cors import CORS
from ana import LocationValidator
import logging

app = Flask(__name__)
CORS(app)

# Loglama ayarları
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

validator = LocationValidator()

@app.route('/validate-location', methods=['POST'])
def validate_location():
    try:
        data = request.json
        address = data.get('address')
        city = data.get('city')
        
        logger.debug(f"Gelen istek: address={address}, city={city}")
        
        # Koordinat formatını kontrol et
        if ',' in address:
            try:
                lat, lon = map(float, address.split(','))
                logger.debug(f"Koordinat formatı tespit edildi: lat={lat}, lon={lon}")
                is_valid = validator.is_point_in_city(lat, lon, city)
                logger.debug(f"Koordinat doğrulama sonucu: {is_valid}")
                return jsonify({'isValid': is_valid})
            except ValueError as e:
                logger.error(f"Koordinat dönüşüm hatası: {e}")
                pass
        
        # Adres olarak işle
        logger.debug("Adres formatı ile devam ediliyor")
        coordinates = validator.get_coordinates_from_address(address)
        if coordinates:
            lat, lon = coordinates
            logger.debug(f"Adres koordinatlara çevrildi: lat={lat}, lon={lon}")
            is_valid = validator.is_point_in_city(lat, lon, city)
            logger.debug(f"Adres doğrulama sonucu: {is_valid}")
            return jsonify({'isValid': is_valid})
        else:
            logger.error("Adres koordinatlara çevrilemedi")
        
        return jsonify({'isValid': False})
    except Exception as e:
        logger.error(f"Genel hata oluştu: {str(e)}")
        return jsonify({'isValid': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True) 