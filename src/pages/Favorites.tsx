import React from 'react';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';

const Favorites: React.FC = () => {
    const { properties, favorites } = useApp();
    const favoriteProperties = properties.filter(p => favorites.includes(p.id));

    return (
        <div className="container">
            <h1 className="page-title">Избранное</h1>

            {favoriteProperties.length === 0 ? (
                <div className="empty-state">
                    {/*<svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">*/}
                    {/*    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />*/}
                    {/*</svg>*/}
                    <p className="empty-text">У вас пока нет избранных объектов</p>
                    <a href="/" className="empty-link">
                        Перейти к поиску
                    </a>
                </div>
            ) : (
                <div className="properties-grid">
                    {favoriteProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;