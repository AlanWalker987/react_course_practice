import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './Map.module.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import { useCities } from '../contexts/Citycontext';
import { useGeolocation } from '../hooks/useGeoLocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

export default function Map() {
    const { cities } = useCities();
    const { isLoading: isLoadingPosition, position: geoLocationPosition, getPosition } = useGeolocation();
    const [mapPosition, setMapPosition] = useState([40, 0])
    const [mapLat, mapLng] = useUrlPosition();

    useEffect(function () {
        if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    }, [mapLat, mapLng])

    useEffect(function () {
        if (geoLocationPosition)
            setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng])
    }, [geoLocationPosition]);

    return (
        <div className={Styles.mapContainer}>
            <Button type="position" onClick={getPosition}>{isLoadingPosition ? "Loading..." : "use your location"}</Button>
            <MapContainer className={Styles.map} center={mapPosition} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) =>
                (<Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                    <Popup>
                        <span>{city.cityName}</span>
                    </Popup>
                </Marker>))}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    )
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvent({
        click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    });
}
