import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CityDetails.css';

function CityDetails() {
    const { city } = useParams();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [addressType, setAddressType] = useState('address');
    const [validationMessage, setValidationMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationMessage('');
        
        try {
            const requestData = {
                location_type: addressType,
                location: address,
                city: city
            };

            console.log('İstek gönderiliyor:', requestData);
            const response = await fetch('http://localhost:8000/api/check-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('Sunucu yanıtı:', data);
            
            if (data.is_valid) {
                setValidationMessage('Girilen konum şehir sınırları içindedir.');
                setIsValid(true);
            } else {
                setValidationMessage('Hata! Girilen konum şehir sınırları dışındadır.');
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

    const handleContinue = () => {
        // Bir sonraki sayfaya yönlendir ve verileri aktar
        navigate(`/delivery-points/${city}`, {
            state: {
                startingPoint: addressType === 'coordinates' ? address.split(',').map(Number) : null,
                address: address,
                addressType: addressType
            }
        });
    };

    return (
        <div className="city-details-container">
            <div className="city-header">
                <h2>Seçilen Şehir: {city}</h2>
            </div>
            <div className="address-form-container">
                <h3>Başlangıç Noktası Girişi</h3>
                <form onSubmit={handleAddressSubmit}>
                    <div className="form-group">
                        <label htmlFor="address">Kendinize bir başlangıç noktası adresi veya koordinatı giriniz:</label>
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
                        {isValid && (
                            <button 
                                type="button" 
                                className="continue-button"
                                onClick={handleContinue}
                            >
                                Devam Et
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CityDetails; 