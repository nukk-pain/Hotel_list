// components/Map.js
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from '../styles/Home.module.css';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// 경도 값을 -180 ~ 180 범위로 조정
const wrapLng = (lng) => {
    let wrapped = lng;
    while (wrapped > 180) wrapped -= 360;
    while (wrapped < -180) wrapped += 360;
    return wrapped;
};

const Map = ({ hotels }) => {
    return (
        <MapContainer
            center={[24.418626, 54.434638]}
            zoom={3}
            style={{ height: '100vh', width: '100%' }}
            worldCopyJump={true} // 지구를 돌 때 마커 위치 유지
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                noWrap={false} // 타일 반복 허용
            />
            {hotels.flatMap((hotel, index) => {
                const wrappedLng = wrapLng(hotel.lng);
                // -360, 0, +360 위치에 마커 생성
                return [-1, 0, 1].map(n => (
                    <Marker
                        key={`${index}-${n}`} // 고유 키 생성
                        position={[hotel.lat, wrappedLng + 360 * n]} // 다중 경도 위치
                        icon={markerIcon}
                    >
                        <Popup className={styles.popupContainer}>
                            <div className={styles.popupContent}>
                                <strong className={styles.popupHotelName}>{hotel.name}</strong><br />
                                <strong className={styles.popupHotelBrand}>{hotel.brand?.label}</strong><br />
                                Cat {hotel.awardCategory?.label || 'N/A'}<br />
                                <a
                                    href={hotel.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.popupHotelLink}
                                >
                                    Visit Website
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ));
            })}
        </MapContainer>
    );
};

export default Map;