import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';
import SearchFilters from '../components/SearchFilters';

const Home: React.FC = () => {
    const { properties } = useApp();

    // 1. Безопасная загрузка фильтров из памяти
    const [filters, setFilters] = useState(() => {
        try {
            const saved = localStorage.getItem('rent_filters');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    // 2. Реактивный расчёт списка (заменяет useState + useEffect)
    const filteredProperties = useMemo(() => {
        if (!properties || properties.length === 0) return [];

        const result = properties.filter(p => {
            if (filters.category && p.category !== filters.category) return false;
            if (filters.priceMin && p.price < Number(filters.priceMin)) return false;
            if (filters.priceMax && p.price > Number(filters.priceMax)) return false;
            if (filters.rooms && p.rooms !== filters.rooms) return false;
            if (filters.areaMin && p.area < Number(filters.areaMin)) return false;
            if (filters.areaMax && p.area > Number(filters.areaMax)) return false;

            // Этаж: точное совпадение первого числа
            if (filters.floor) {
                const floorNum = p.floor.split('/')[0].trim();
                if (floorNum !== filters.floor) return false;
            }

            // Залог: 'no' -> 0, 'yes' -> больше 0
            if (filters.deposit === 'no' && p.deposit !== 0) return false;
            if (filters.deposit === 'yes' && p.deposit === 0) return false;

            // Тип дома
            if (filters.houseType && p.houseType !== filters.houseType) return false;

            // Лифт
            if (filters.elevator) {
                const hasElevator = p.elevator && (p.elevator.passenger > 0 || p.elevator.cargo > 0);
                if (filters.elevator === 'yes' && !hasElevator) return false;
                if (filters.elevator === 'no' && hasElevator) return false;
            }

            // Минуты до метро
            if (filters.minutesToMetro && (p.minutesToMetro || 99) > Number(filters.minutesToMetro)) return false;

            // Удобства
            if (filters.amenities?.length > 0 && !filters.amenities.every((a: string) => p.amenities.includes(a))) return false;

            // Поиск по тексту
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (!p.address.toLowerCase().includes(q) && !p.metro.toLowerCase().includes(q) && !p.title.toLowerCase().includes(q)) return false;
            }

            return true;
        });

        // Сортировка
        const sortType = filters.sort || 'new';
        switch (sortType) {
            case 'price_asc': result.sort((a, b) => a.price - b.price); break;
            case 'price_desc': result.sort((a, b) => b.price - a.price); break;
            case 'new': default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return result;
    }, [properties, filters]);

    // 3. Обновление фильтров с сохранением в память
    const updateFilters = (newFilters: any) => {
        setFilters(newFilters);
        localStorage.setItem('rent_filters', JSON.stringify(newFilters));
    };

    return (
        <div className="home-wrapper">
            <h1 className="main-title">Арендовать недвижимость в Москве</h1>

            <div className="search-sort-bar">
                <input
                    type="text"
                    placeholder="Метро, улица или название ЖК"
                    value={filters.search || ''}
                    onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
                    className="search-input-bar"
                />
                <select
                    value={filters.sort || ''}
                    onChange={(e) => updateFilters({ ...filters, sort: e.target.value })}
                    className="sort-select-bar"
                >
                    <option value="">По умолчанию</option>
                    <option value="price_asc">Сначала дешёвые</option>
                    <option value="price_desc">Сначала дорогие</option>
                    <option value="new">По новизне</option>
                </select>
            </div>

            <div className="content-layout">
                <div className="sidebar">
                    <SearchFilters initialFilters={filters} onSearch={updateFilters} />
                </div>

                <div className="cards-area">
                    {filteredProperties.length === 0 ? (
                        <div className="empty-state">
                            <p className="empty-text">Недвижимость не найдена</p>
                            <p className="empty-text" style={{ fontSize: '14px', marginTop: '8px' }}>
                                Попробуйте изменить параметры поиска или сбросить фильтры
                            </p>
                        </div>
                    ) : (
                        <div className="properties-grid">
                            {filteredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;