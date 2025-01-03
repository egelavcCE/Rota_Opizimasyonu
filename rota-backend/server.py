from flask import Flask, request, jsonify
from flask_cors import CORS
from ana import LocationValidator
from route_model import RouteModel

app = Flask(__name__)
CORS(app)

validator = LocationValidator()

@app.route('/api/check-location', methods=['POST'])
def check_location():
    try:
        data = request.json
        location = data.get('location')
        city = data.get('city')
        location_type = data.get('location_type', 'address')
        existing_addresses = data.get('existing_addresses', [])
        starting_address = data.get('starting_address')

        # Başlangıç noktası kontrolü
        if starting_address == location:
            return jsonify({
                'is_valid': False,
                'error': 'Başlangıç noktası sipariş noktası olarak seçilemez!'
            })

        # Mevcut adresler kontrolü
        if location in existing_addresses:
            return jsonify({
                'is_valid': False,
                'error': 'Bu adres zaten rotaya dahil edilmiş!'
            })

        if location_type == 'coordinates':
            try:
                lat, lon = map(float, location.split(','))
                is_valid = validator.is_point_in_city(lat, lon, city)
                return jsonify({'is_valid': is_valid})
            except ValueError:
                return jsonify({'is_valid': False, 'error': 'Geçersiz koordinat formatı'})
        else:
            coordinates = validator.get_coordinates_from_address(location)
            if coordinates:
                lat, lon = coordinates
                is_valid = validator.is_point_in_city(lat, lon, city)
                return jsonify({'is_valid': is_valid})
            return jsonify({'is_valid': False, 'error': 'Adres bulunamadı'})

    except Exception as e:
        return jsonify({'is_valid': False, 'error': str(e)})

@app.route('/api/optimize-route', methods=['POST'])
def optimize_route():
    try:
        data = request.json
        starting_point = data.get('starting_point')  # Bu bir liste olabilir veya None olabilir
        starting_address = data.get('starting_address')  # String olarak adres
        delivery_points = data.get('delivery_points', [])

        # Başlangıç noktasının koordinatlarını al
        if starting_point:  # Eğer koordinat olarak verilmişse
            start_coords = tuple(starting_point)  # [lat, lon] -> (lat, lon)
        else:  # Adres olarak verilmişse
            start_coords = validator.get_coordinates_from_address(starting_address)
            if not start_coords:
                return jsonify({
                    'success': False,
                    'error': 'Başlangıç noktası koordinatları alınamadı'
                })

        # RouteModel'i başlat
        route_model = RouteModel(start_coords)

        # Teslimat noktalarını ekle
        for point in delivery_points:
            if point['type'] == 'coordinates':
                lat, lon = map(float, point['address'].split(','))
                route_model.add_stop(point['address'], (lat, lon))
            else:
                coordinates = validator.get_coordinates_from_address(point['address'])
                if coordinates:
                    route_model.add_stop(point['address'], coordinates)
                else:
                    return jsonify({
                        'success': False,
                        'error': f'Koordinatlar alınamadı: {point["address"]}'
                    })

        # Rotayı optimize et
        route_model.optimize_route()

        # Optimize edilmiş rotayı döndür
        optimized_route = route_model.get_optimized_route()
        
        return jsonify({
            'success': True,
            'route': optimized_route
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True) 