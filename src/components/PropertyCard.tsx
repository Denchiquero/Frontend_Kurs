import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../types';
import { useApp } from '../context/AppContext';

interface PropertyCardProps {
    property: Property;
    showMenu?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
                                                       property,
                                                       showMenu = false,
                                                       onEdit,
                                                       onDelete
                                                   }) => {
    const { isFavorite, addFavorite, removeFavorite, currentUser } = useApp();
    const [menuOpen, setMenuOpen] = useState(false);
    const favorite = isFavorite(property.id);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (favorite) {
            removeFavorite(property.id);
        } else {
            addFavorite(property.id);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);
        onEdit?.();
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);
        if (window.confirm('Вы уверены, что хотите удалить объявление?')) {
            onDelete?.();
        }
    };

    return (
        <div className="property-card-wrapper">
            <Link to={`/property/${property.id}`} className="property-card">
                <div className="property-image-wrapper">
                    <img src={property.image} alt={property.title} className="property-image" />

                    {currentUser && (
                        <button
                            onClick={toggleFavorite}
                            className={`favorite-btn ${favorite ? 'active' : ''}`}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={favorite ? "#ef4444" : "none"} stroke={favorite ? "#ef4444" : "#9ca3af"} strokeWidth="2">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    )}

                    {showMenu && (
                        <div className="property-menu-wrapper">
                            <button
                                className="property-menu-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setMenuOpen(!menuOpen);
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="5" r="2"/>
                                    <circle cx="12" cy="12" r="2"/>
                                    <circle cx="12" cy="19" r="2"/>
                                </svg>
                            </button>

                            {menuOpen && (
                                <div className="property-menu">
                                    <button className="property-menu-item" onClick={handleEdit}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                        Редактировать
                                    </button>
                                    <button className="property-menu-item delete" onClick={handleDelete}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                        </svg>
                                        Удалить
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="property-content">
                    <div className="property-price">
                        {property.price.toLocaleString('ru-RU')} руб/месяц
                    </div>

                    <div className="property-info">
                        {property.area} м² • {property.rooms} • {property.floor}
                    </div>

                    <h3 className="property-title">
                        {property.title}
                    </h3>

                    <div className="property-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        М. {property.metro}
                    </div>
                    <div className="property-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.address}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PropertyCard;