import React, { useState } from 'react';

interface SearchFiltersProps {
    onSearch: (filters: any) => void;
    initialFilters?: any; // Добавляем поддержку начальных фильтров
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, initialFilters }) => {
    const [extendedOpen, setExtendedOpen] = useState(false);

    // Дефолтные значения
    const defaultFilters = {
        category: '', priceMin: '', priceMax: '', rooms: '',
        areaMin: '', areaMax: '', floor: '', amenities: [] as string[],
        deposit: '', minutesToMetro: '', houseType: '', elevator: ''
    };

    // Безопасная инициализация: берем initialFilters и дополняем дефолтами
    const [filters, setFilters] = useState(() => ({
        ...defaultFilters,
        ...(initialFilters || {})
    }));

    const handleChange = (field: string, value: any) => {
        const updated = { ...filters, [field]: value };
        setFilters(updated);
        onSearch(updated);
    };

    const toggleAmenity = (amenity: string) => {
        // Гарантируем, что amenities это массив
        const currentAmenities = Array.isArray(filters.amenities) ? filters.amenities : [];
        const updated = currentAmenities.includes(amenity)
            ? currentAmenities.filter(a => a !== amenity)
            : [...currentAmenities, amenity];
        handleChange('amenities', updated);
    };

    const clearAll = () => {
        setFilters(defaultFilters);
        onSearch(defaultFilters);
    };

    const hasFilters = Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== '');
    const commonAmenities = ['Wi-Fi', 'Кондиционер', 'Стиральная машина', 'Посудомоечная машина', 'Балкон', 'Парковка', 'Охрана', 'Мебель'];

    return (
        <div className="sidebar-filters">
            <h3 className="sidebar-title">Параметры</h3>

            <div className="filter-group">
                <label className="filter-label">Тип недвижимости</label>
                <select value={filters.category} onChange={(e) => handleChange('category', e.target.value)} className="form-select select">
                    <option value="">Все типы</option>
                    <option value="apartment">Квартира</option>
                    <option value="studio">Студия</option>
                    <option value="house">Дом</option>
                    <option value="commercial">Коммерческая</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Цена, ₽</label>
                <div className="range-row">
                    <input type="number" placeholder="от" value={filters.priceMin} onChange={(e) => handleChange('priceMin', e.target.value)} className="form-select half" />
                    <input type="number" placeholder="до" value={filters.priceMax} onChange={(e) => handleChange('priceMax', e.target.value)} className="form-select half" />
                </div>
            </div>

            <div className="filter-group">
                <label className="filter-label">Комнаты</label>
                <select value={filters.rooms} onChange={(e) => handleChange('rooms', e.target.value)} className="form-select select">
                    <option value="">Любое</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4" >4+</option>
                </select>
            </div>

            <button
                className={`toggle-btn ${extendedOpen ? 'open' : ''} form-select`}
                onClick={() => setExtendedOpen(!extendedOpen)}
            >
                {extendedOpen ? 'Скрыть' : 'Все фильтры'}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform: extendedOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}}>
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            <div className={`extended-content ${extendedOpen ? 'visible' : ''}`}>
                <div className="filter-group">
                    <label className="filter-label">Площадь, м²</label>
                    <div className="range-row">
                        <input type="number" placeholder="от" value={filters.areaMin} onChange={(e) => handleChange('areaMin', e.target.value)} className="form-select half" />
                        <input type="number" placeholder="до" value={filters.areaMax} onChange={(e) => handleChange('areaMax', e.target.value)} className="form-select half" />
                    </div>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Этаж</label>
                    <input type="text" placeholder="Например: 17" value={filters.floor} onChange={(e) => handleChange('floor', e.target.value)} className="form-select" />
                </div>

                <div className="filter-group">
                    <label className="filter-label">Залог</label>
                    <select value={filters.deposit} onChange={(e) => handleChange('deposit', e.target.value)} className="form-select">
                        <option value="">Любой</option>
                        <option value="no">Без залога</option>
                        <option value="yes">Есть залог</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Минут до метро</label>
                    <input type="number" placeholder="до" value={filters.minutesToMetro} onChange={(e) => handleChange('minutesToMetro', e.target.value)} className="form-select" />
                </div>

                <div className="filter-group">
                    <label className="filter-label">Тип дома</label>
                    <select value={filters.houseType} onChange={(e) => handleChange('houseType', e.target.value)} className="form-select">
                        <option value="">Любой</option>
                        <option value="brick">Кирпич</option>
                        <option value="panel">Панель</option>
                        <option value="monolith">Монолит</option>
                        <option value="wood">Дерево</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Лифт</label>
                    <select value={filters.elevator} onChange={(e) => handleChange('elevator', e.target.value)} className="form-select">
                        <option value="">Не важно</option>
                        <option value="yes">Есть</option>
                        <option value="no">Нет</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Удобства</label>
                    <div className="amenities-list">
                        {commonAmenities.map(a => (
                            <label key={a} className="amenity-chip small">
                                <input type="checkbox" checked={filters.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                                <span>{a}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {hasFilters && (
                <button className="clear-filters-btn" onClick={clearAll}>
                    Сбросить всё
                </button>
            )}
        </div>
    );
};

export default SearchFilters;