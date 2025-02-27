import dynamic from 'next/dynamic';
import { useState } from 'react';
import hotels from '../data/hyatt_list.json';
import styles from '../styles/Home.module.css';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const uniqueBrands = [...new Set(hotels.map(hotel => hotel.brand?.label || 'UNKNOWN_BRAND'))]
    .filter(brand => !brand.startsWith('UNKNOWN')).sort();
const uniqueCountries = [...new Set(hotels.map(hotel => hotel.location?.country?.label || 'UNKNOWN_COUNTRY'))]
    .filter(country => !country.startsWith('UNKNOWN')).sort();
const uniqueRegions = [...new Set(hotels.map(hotel => hotel.location?.region?.label || 'UNKNOWN_REGION'))]
    .filter(region => !region.startsWith('UNKNOWN')).sort();

export default function Home() {
    const [brandFilters, setBrandFilters] = useState(new Set(uniqueBrands));
    const [countryFilters, setCountryFilters] = useState(new Set(uniqueCountries));
    const [regionFilters, setRegionFilters] = useState(new Set(uniqueRegions));

    // 접기/펼치기 상태를 관리하기 위한 state 추가
    const [isBrandCollapsed, setIsBrandCollapsed] = useState(false);
    const [isCountryCollapsed, setIsCountryCollapsed] = useState(false);
    const [isRegionCollapsed, setIsRegionCollapsed] = useState(false);


    // 필터링된 호텔 리스트
    const filteredHotels = hotels.filter(hotel => {
        const brandKey = hotel.brand?.label || 'UNKNOWN_BRAND';
        const countryKey = hotel.location?.country?.label || 'UNKNOWN_COUNTRY';
        const regionKey = hotel.location?.region?.label || 'UNKNOWN_REGION';

        return (
            brandFilters.has(brandKey) &&
            countryFilters.has(countryKey) &&
            regionFilters.has(regionKey)
        );
    });

    const toggleAll = (filterSet, setFilter, allOptions) => {
        const newSet = new Set(filterSet);
        if (newSet.size === allOptions.length) {
            newSet.clear();
        } else {
            allOptions.forEach(option => newSet.add(option));
        }
        setFilter(newSet);
    };

    const toggleFilter = (filterSet, setFilter, value) => {
        const newSet = new Set(filterSet);
        if (newSet.has(value)) {
            newSet.delete(value);
        } else {
            newSet.add(value);
        }
        setFilter(newSet);
    };

    // 접기/펼치기 토글 함수
    const toggleBrandCollapse = () => setIsBrandCollapsed(!isBrandCollapsed);
    const toggleCountryCollapse = () => setIsCountryCollapsed(!isCountryCollapsed);
    const toggleRegionCollapse = () => setIsRegionCollapsed(!isRegionCollapsed);


    return (
        <div className={styles.container}>
            {/* 필터 패널 */}
            <div className={styles.filterPanel}>
                <h2 className={styles.filterTitle}>Filters</h2>

                {/* 브랜드 필터 섹션 */}
                <div className={styles.filterSection}>
                    <div className={styles.filterSectionHeader} onClick={toggleBrandCollapse}>
                        <h3 className={styles.filterSectionTitle}>Brands</h3>
                        <span className={styles.filterCollapseIcon}>{isBrandCollapsed ? '▼' : '▲'}</span>
                    </div>
                    {/* isBrandCollapsed 상태에 따라 내용이 접히거나 펼쳐집니다. */}
                    {!isBrandCollapsed && (
                        <div>
                            <label className={styles.filterLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={brandFilters.size === uniqueBrands.length}
                                    onChange={() => toggleAll(brandFilters, setBrandFilters, uniqueBrands)}
                                />
                                <span className={styles.allCheckbox}>All Brands</span>
                            </label>
                            {uniqueBrands.map(brand => (
                                <div key={brand}>
                                    <label className={styles.filterLabel}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={brandFilters.has(brand)}
                                            onChange={() => toggleFilter(brandFilters, setBrandFilters, brand)}
                                        />
                                        {brand}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 국가 필터 섹션 */}
                <div className={styles.filterSection}>
                    <div className={styles.filterSectionHeader} onClick={toggleCountryCollapse}>
                        <h3 className={styles.filterSectionTitle}>Countries</h3>
                        <span className={styles.filterCollapseIcon}>{isCountryCollapsed ? '▼' : '▲'}</span>
                    </div>
                    {!isCountryCollapsed && (
                        <div>
                            <label className={styles.filterLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={countryFilters.size === uniqueCountries.length}
                                    onChange={() => toggleAll(countryFilters, setCountryFilters, uniqueCountries)}
                                />
                                <span className={styles.allCheckbox}>All Countries</span>
                            </label>
                            {uniqueCountries.map(country => (
                                <div key={country}>
                                    <label className={styles.filterLabel}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={countryFilters.has(country)}
                                            onChange={() => toggleFilter(countryFilters, setCountryFilters, country)}
                                        />
                                        {country}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 지역 필터 섹션 */}
                <div className={styles.filterSection}>
                    <div className={styles.filterSectionHeader} onClick={toggleRegionCollapse}>
                        <h3 className={styles.filterSectionTitle}>Regions</h3>
                        <span className={styles.filterCollapseIcon}>{isRegionCollapsed ? '▼' : '▲'}</span>
                    </div>
                    {!isRegionCollapsed && (
                        <div>
                            <label className={styles.filterLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={regionFilters.size === uniqueRegions.length}
                                    onChange={() => toggleAll(regionFilters, setRegionFilters, uniqueRegions)}
                                />
                                <span className={styles.allCheckbox}>All Regions</span>
                            </label>
                            {uniqueRegions.map(region => (
                                <div key={region}>
                                    <label className={styles.filterLabel}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={regionFilters.has(region)}
                                            onChange={() => toggleFilter(regionFilters, setRegionFilters, region)}
                                        />
                                        {region}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 맵 */}
            <div className={styles.mapContainer}>
                <h1 className={styles.mapTitle}>Hyatt Hotels Map (2025.02)</h1>
                <Map hotels={filteredHotels} />
            </div>
        </div>
    );
}