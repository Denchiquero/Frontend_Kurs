import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PropertyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { properties, isFavorite, addFavorite, removeFavorite, currentUser } = useApp();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Исправлен синтаксис стрелочной функции
    const property = properties.find(p => p.id === Number(id));

    if (!property) {
        return (
            <div className="container">
                <div className="empty-state">
                    <h2 className="page-title">Объект не найден</h2>
                    <button onClick={() => navigate('/')} className="btn-primary">На главную</button>
                </div>
            </div>
        );
    }

    const favorite = isFavorite(property.id);
    const toggleFavorite = () => favorite ? removeFavorite(property.id) : addFavorite(property.id);

    return (
        <div className="detail-page-wrapper">
            <div className="container detail-page">

                {/* 1. ЗАГОЛОВОК + ИЗБРАННОЕ */}
                <div className="detail-header-block">
                    <h1 className="detail-title-main">{property.title}</h1>
                    {currentUser && (
                        <button onClick={toggleFavorite} className={`fav-toggle-btn ${favorite ? 'active' : ''}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {favorite ? 'В избранном' : 'В избранное'}
                        </button>
                    )}
                </div>

                {/* 2. СЕТКА: ФОТО (ЛЕВО) | ЦЕНА+ЗАЛОГ+СВЯЗЬ (ПРАВО) */}
                <div className="detail-middle-section">
                    <div className="detail-gallery-block">
                        <div className="gallery-main">
                            <img src={property.images[currentImageIndex]} alt={property.title} className="gallery-main-img" />
                        </div>
                        {property.images.length > 1 && (
                            <div className="gallery-thumbs">
                                {property.images.map((img, idx) => (
                                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`gallery-thumb ${currentImageIndex === idx ? 'active' : ''}`}>
                                        <img src={img} alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="detail-right-info">
                        <div className="detail-price-main">{property.price.toLocaleString('ru-RU')} ₽/мес</div>
                        <div className="detail-deposit">
                            <strong>Залог:</strong> {property.deposit > 0 ? `${property.deposit.toLocaleString('ru-RU')} ₽` : 'Без залога'}
                        </div>
                        <div className="contact-actions" style={{ marginTop: 'auto' }}>
                            <button className="btn-contact primary">Позвонить</button>
                            <button className="btn-contact secondary">Написать</button>
                        </div>
                    </div>
                </div>

                {/* 3. ОСОБЕННОСТИ */}
                <div className="detail-section-block">
                    <h2 className="section-heading">Особенности</h2>
                    <div className="features-tags">
                        {property.features?.map((f, i) => (
                            <span key={i} className="feature-tag">{f}</span>
                        ))}
                    </div>
                </div>

                {/* 4. ИНФОРМАЦИЯ, ОПЛАТА, ПРАВИЛА */}
                <div className="detail-structured-info">
                    <div className="detail-section-block">
                        <h2 className="section-heading">Характеристики</h2>
                        <div className="info-grid">
                            <div className="info-row"><span className="info-label">Комнаты:</span><span className="info-value">{property.rooms}</span></div>
                            <div className="info-row"><span className="info-label">Этаж:</span><span className="info-value">{property.floor}</span></div>
                            <div className="info-row"><span className="info-label">Площадь:</span><span className="info-value">{property.area} м²</span></div>
                            <div className="info-row"><span className="info-label">Санузел:</span><span className="info-value">{property.bathroom === 'combined' ? 'Совмещённый' : 'Раздельный'}</span></div>
                            <div className="info-row"><span className="info-label">Тип дома:</span><span className="info-value">{{ brick: 'Кирпич', panel: 'Панель', wood: 'Дерево', monolith: 'Монолит' }[property.houseType] || 'Монолит'}</span></div>
                            <div className="info-row"><span className="info-label">Лифты:</span><span className="info-value">{property.elevator.passenger} пасс., {property.elevator.cargo} груз.</span></div>
                        </div>
                    </div>

                    <div className="detail-section-block">
                        <h2 className="section-heading">Условия аренды</h2>
                        <div className="info-grid">
                            <div className="info-row"><span className="info-label">ЖКУ:</span><span className="info-value">{property.utilitiesIncluded ? 'Включены в платёж' : 'Оплачиваются отдельно'}</span></div>
                            <div className="info-row"><span className="info-label">Комиссия:</span><span className="info-value">0%</span></div>
                        </div>
                    </div>

                    <div className="detail-section-block">
                        <h2 className="section-heading">Правила</h2>
                        <div className="info-grid">
                            <div className="info-row"><span className="info-label">Можно с детьми:</span><span className="info-value">{property.rules.children ? 'Да' : 'Нет'}</span></div>
                            <div className="info-row"><span className="info-label">Можно курить:</span><span className="info-value">{property.rules.smoking ? 'Да' : 'Нет'}</span></div>
                            <div className="info-row"><span className="info-label">Можно с питомцем:</span><span className="info-value">{property.rules.pets ? 'Да' : 'Нет'}</span></div>
                        </div>
                    </div>
                </div>

                {/* 5. ТЕКСТОВОЕ ОПИСАНИЕ */}
                <div className="detail-section-block">
                    <h2 className="section-heading">Описание</h2>
                    <p className="detail-description">{property.description}</p>
                </div>

            </div>
        </div>
    );
};

export default PropertyDetail;