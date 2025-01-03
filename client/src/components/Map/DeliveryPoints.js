import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './DeliveryPoints.css';

function DeliveryPoints() {
    const { city } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const startingPoint = location.state?.startingPoint;
    const startingAddress = location.state?.address;

    const [numOrders, setNumOrders] = useState('');
    const [currentOrder, setCurrentOrder] = useState(1);
    const [address, setAddress] = useState('');
    const [addressType, setAddressType] = useState('address');
    const [validationMessage, setValidationMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryPoints, setDeliveryPoints] = useState([]);
    const [optimizedRoute, setOptimizedRoute] = useState(null);
    const [showRoute, setShowRoute] = useState(false);

    const handleNumOrdersSubmit = (e) => {
        e.preventDefault();
        const num = parseInt(numOrders);
        if (num >= 1 && num <= 10) {
            setCurrentOrder(1);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationMessage('');
        
        try {
            const requestData = {
                location_type: addressType,
                location: address,
                city: city,
                starting_address: startingAddress,
                existing_addresses: deliveryPoints.map(point => point.address)
            };

            const response = await fetch('http://localhost:8000/api/check-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            
            if (data.is_valid) {
                setValidationMessage('Girilen konum şehir sınırları içindedir.');
                setIsValid(true);
                // Adresi kaydet
                setDeliveryPoints([...deliveryPoints, { address, type: addressType }]);
                // Sonraki siparişe geç
                if (currentOrder < parseInt(numOrders)) {
                    setCurrentOrder(currentOrder + 1);
                    setAddress('');
                    setIsValid(false);
                    setValidationMessage('');
                }
            } else {
                setValidationMessage(`Hata! ${data.error || 'Girilen konum şehir sınırları dışındadır.'}`);
                setIsValid(false);
            }
        } catch (error) {
            console.error('Hata:', error);
            setValidationMessage(`Bir hata oluştu: ${error.message}`);
            setIsValid(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        
        const isCoordinate = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(value);
        setAddressType(isCoordinate ? 'coordinates' : 'address');
    };

    const handleContinue = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/optimize-route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    starting_point: startingPoint,
                    starting_address: startingAddress,
                    delivery_points: deliveryPoints
                })
            });

            const data = await response.json();
            console.log('Optimize edilmiş rota:', data);
            
            if (data.success) {
                setOptimizedRoute(data.route);
                setShowRoute(true);
            } else {
                setValidationMessage(`Rota oluşturulurken bir hata oluştu: ${data.error}`);
            }
        } catch (error) {
            console.error('Hata:', error);
            setValidationMessage(`Rota oluşturulurken bir hata oluştu: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const createGoogleMapsUrl = () => {
        if (!startingAddress || !optimizedRoute || optimizedRoute.length === 0) {
            console.log('Eksik veri:', { startingAddress, optimizedRoute });
            return null;
        }
        
        const baseUrl = "https://www.google.com/maps/dir/?api=1";
        const origin = `&origin=${encodeURIComponent(startingAddress)}`;
        
        // Son noktayı varış noktası olarak al
        const destination = optimizedRoute[optimizedRoute.length - 1];
        const destinationParam = `&destination=${encodeURIComponent(destination)}`;
        
        // Ara noktaları waypoints olarak ekle (son nokta hariç)
        let waypointsParam = '';
        if (optimizedRoute.length > 1) {
            const waypoints = optimizedRoute.slice(0, -1);
            waypointsParam = `&waypoints=${waypoints.map(point => encodeURIComponent(point)).join('|')}`;
        }

        const travelMode = "&travelmode=driving";
        
        const finalUrl = `${baseUrl}${origin}${destinationParam}${waypointsParam}${travelMode}`;
        console.log('Oluşturulan URL:', finalUrl);
        return finalUrl;
    };

    const handleNavigate = () => {
        const url = createGoogleMapsUrl();
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="delivery-points-container">
            <div className="header-info">
                <h2>Şehir: {city}</h2>
                <h3>Başlangıç Adresi: {startingAddress}</h3>
            </div>

            {showRoute ? (
                <div className="route-display">
                    <h3>Optimize Edilmiş Rota</h3>
                    <div className="route-list">
                        <div className="route-item">
                            <span className="route-number">Başlangıç</span>
                            <span className="route-address">{startingAddress}</span>
                        </div>
                        {optimizedRoute.map((address, index) => (
                            <div key={index} className="route-item">
                                <span className="route-number">Durak {index + 1}</span>
                                <span className="route-address">{address}</span>
                            </div>
                        ))}
                    </div>
                    <button 
                        className="navigation-button"
                        onClick={handleNavigate}
                    >
                        Navigasyonda Aç
                    </button>
                </div>
            ) : !numOrders ? (
                <div className="order-count-container">
                    <h3>Sipariş Noktası Sayısı</h3>
                    <form onSubmit={handleNumOrdersSubmit}>
                        <div className="form-group">
                            <label htmlFor="numOrders">Kaç adet sipariş noktası gireceksiniz? (1-10 arası):</label>
                            <input
                                type="number"
                                id="numOrders"
                                min="1"
                                max="10"
                                value={numOrders}
                                onChange={(e) => setNumOrders(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={!numOrders || numOrders < 1 || numOrders > 10}
                        >
                            Devam Et
                        </button>
                    </form>
                </div>
            ) : (
                <div className="delivery-point-form">
                    <h3>{currentOrder}. Sipariş Noktası</h3>
                    <form onSubmit={handleAddressSubmit}>
                        <div className="form-group">
                            <label htmlFor="address">Teslimat adresi veya koordinatı giriniz:</label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={handleInputChange}
                                placeholder="Örnek: Atatürk Caddesi No:1 veya 39.925533,32.866287"
                                required
                            />
                            <small className="input-help">
                                {addressType === 'address' ? 
                                    '* Adres girerken sokak/cadde adı, bina no ve ilçe adını yazmayı unutmayın' :
                                    '* Koordinat formatı: enlem,boylam (örn: 39.925533,32.866287)'}
                            </small>
                        </div>
                        {validationMessage && (
                            <div className="validation-message" style={{ color: isValid ? 'green' : 'red' }}>
                                {validationMessage}
                            </div>
                        )}
                        <div className="button-group">
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={!address || isLoading}
                            >
                                {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
                            </button>
                        </div>
                    </form>

                    {deliveryPoints.length === parseInt(numOrders) && (
                        <div className="final-step">
                            <h3>Tüm teslimat noktaları girildi!</h3>
                            <button 
                                className="continue-button"
                                onClick={handleContinue}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Rota Oluşturuluyor...' : 'Devam Et'}
                            </button>
                        </div>
                    )}

                    <div className="delivery-points-list">
                        <h4>Girilen Teslimat Noktaları:</h4>
                        <ul>
                            {deliveryPoints.map((point, index) => (
                                <li key={index}>
                                    {index + 1}. Nokta: {point.address}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeliveryPoints; 