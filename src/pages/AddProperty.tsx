import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';
import type { Property, HouseType, BathroomType } from '../types';

interface AddPropertyProps {
    editMode?: boolean;
    propertyData?: Property;
    onSubmit?: (data: Omit<Property, 'id' | 'createdAt' | 'authorId' | 'images' | 'image'>) => void;
    onCancel?: () => void;
}

const AddProperty: React.FC<AddPropertyProps> = ({
                                                     editMode = false,
                                                     propertyData,
                                                     onSubmit,
                                                     onCancel
                                                 }) => {
    const navigate = useNavigate();
    const { addProperty, currentUser } = useApp();

    // Состояние формы — полностью соответствует интерфейсу Property
    const [formData, setFormData] = useState({
        // Основные данные
        title: '', price: '', area: '', rooms: '', floor: '', description: '', address: '', metro: '',
        category: 'apartment' as const, amenities: '',

        // Характеристики
        minutesToMetro: '',
        houseType: 'monolith' as HouseType,
        bathroom: 'combined' as BathroomType,
        elevatorPassenger: false,
        elevatorCargo: false,

        // Условия аренды
        deposit: '',
        utilitiesIncluded: false,

        // Правила
        allowChildren: true,
        allowPets: false,
        allowSmoking: false,

        // Особенности
        features: [] as string[],
        newFeature: ''
    });

    // Заполняем форму при редактировании
    useEffect(() => {
        if (editMode && propertyData) {
            setFormData({
                title: propertyData.title,
                price: String(propertyData.price),
                area: String(propertyData.area),
                rooms: propertyData.rooms,
                floor: propertyData.floor,
                description: propertyData.description,
                address: propertyData.address,
                metro: propertyData.metro,
                category: propertyData.category,
                amenities: propertyData.amenities.join(', '),
                minutesToMetro: String(propertyData.minutesToMetro || ''),
                houseType: propertyData.houseType,
                bathroom: propertyData.bathroom,
                elevatorPassenger: propertyData.elevator.passenger > 0,
                elevatorCargo: propertyData.elevator.cargo > 0,
                deposit: String(propertyData.deposit || ''),
                utilitiesIncluded: propertyData.utilitiesIncluded,
                allowChildren: propertyData.rules.children,
                allowPets: propertyData.rules.pets,
                allowSmoking: propertyData.rules.smoking,
                features: propertyData.features || [],
                newFeature: ''
            });
        }
    }, [editMode, propertyData]);

    if (!currentUser && !editMode) {
        return (
            <div className="container">
                <div className="auth-notice-card">
                    <h2 className="page-title">Требуется авторизация</h2>
                    <p className="section-text" style={{ textAlign: 'center', marginBottom: '24px' }}>
                        Чтобы добавить объявление, необходимо войти в аккаунт.
                    </p>
                    <div style={{ textAlign: 'center' }}>
                        <Link to="/profile" className="search-btn" style={{ textDecoration: 'none' }}>Войти в аккаунт</Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (field: string) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
    };

    const handleFeatureAdd = () => {
        if (formData.newFeature.trim() && !formData.features.includes(formData.newFeature.trim())) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, prev.newFeature.trim()],
                newFeature: ''
            }));
        }
    };

    const handleFeatureRemove = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter(f => f !== feature)
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleFeatureAdd();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const propertyPayload = {
            title: formData.title,
            price: Number(formData.price),
            area: Number(formData.area),
            rooms: formData.rooms,
            floor: formData.floor,
            description: formData.description,
            address: formData.address,
            metro: formData.metro,
            category: formData.category,
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
            amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
            deposit: Number(formData.deposit) || 0,
            minutesToMetro: Number(formData.minutesToMetro) || 0,
            houseType: formData.houseType,
            elevator: {
                passenger: formData.elevatorPassenger ? 1 : 0,
                cargo: formData.elevatorCargo ? 1 : 0
            },
            bathroom: formData.bathroom,
            utilitiesIncluded: formData.utilitiesIncluded,
            rules: {
                children: formData.allowChildren,
                pets: formData.allowPets,
                smoking: formData.allowSmoking
            },
            features: formData.features
        };

        if (editMode && onSubmit) {
            onSubmit(propertyPayload);
        } else {
            addProperty(propertyPayload);
            navigate('/');
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1 className="form-title">{editMode ? 'Редактировать объявление' : 'Добавить объявление'}</h1>

                <form onSubmit={handleSubmit} className="form-card">

                    {/* === ОСНОВНАЯ ИНФОРМАЦИЯ === */}
                    <div className="form-section">
                        <h3 className="section-title">Основная информация</h3>
                        <div className="form-group">
                            <label className="form-label">Категория</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Заголовок</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" placeholder="Например: Уютная 2-комнатная квартира" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Цена (₽/месяц)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-input" placeholder="75000" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Площадь (м²)</label>
                                <input type="number" name="area" value={formData.area} onChange={handleChange} required className="form-input" placeholder="45" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Комнаты</label>
                                <select name="rooms" value={formData.rooms} onChange={handleChange} required className="form-select">
                                    <option value="">Выберите</option>
                                    <option value="Студия">Студия</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="4+">4+</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Этаж</label>
                                <input type="text" name="floor" value={formData.floor} onChange={handleChange} required className="form-input" placeholder="Например: 5/9" />
                            </div>
                        </div>
                    </div>

                    {/* === РАСПОЛОЖЕНИЕ === */}
                    <div className="form-section">
                        <h3 className="section-title">Расположение</h3>
                        <div className="form-group">
                            <label className="form-label">Адрес</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="form-input" placeholder="ул. Примерная, д. 15" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Метро</label>
                                <input type="text" name="metro" value={formData.metro} onChange={handleChange} required className="form-input" placeholder="Тверская" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Минут до метро</label>
                                <input type="number" name="minutesToMetro" value={formData.minutesToMetro} onChange={handleChange} className="form-input" placeholder="5" />
                            </div>
                        </div>
                    </div>

                    {/* === ХАРАКТЕРИСТИКИ === */}
                    <div className="form-section">
                        <h3 className="section-title">Характеристики</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Тип дома</label>
                                <select name="houseType" value={formData.houseType} onChange={handleChange} className="form-select">
                                    <option value="brick">Кирпич</option>
                                    <option value="panel">Панель</option>
                                    <option value="monolith">Монолит</option>
                                    <option value="wood">Дерево</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Санузел</label>
                                <select name="bathroom" value={formData.bathroom} onChange={handleChange} className="form-select">
                                    <option value="combined">Совмещённый</option>
                                    <option value="separate">Раздельный</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Лифты</label>
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={formData.elevatorPassenger} onChange={() => handleCheckbox('elevatorPassenger')} />
                                    Пассажирский
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={formData.elevatorCargo} onChange={() => handleCheckbox('elevatorCargo')} />
                                    Грузовой
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* === УСЛОВИЯ АРЕНДЫ === */}
                    <div className="form-section">
                        <h3 className="section-title">Условия аренды</h3>
                        <div className="form-group">
                            <label className="form-label">Залог (₽)</label>
                            <input type="number" name="deposit" value={formData.deposit} onChange={handleChange} className="form-input" placeholder="0 — без залога" />
                        </div>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input type="checkbox" checked={formData.utilitiesIncluded} onChange={() => handleCheckbox('utilitiesIncluded')} />
                                ЖКУ включены в стоимость аренды
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Правила проживания</label>
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={formData.allowChildren} onChange={() => handleCheckbox('allowChildren')} />
                                    Можно с детьми
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={formData.allowPets} onChange={() => handleCheckbox('allowPets')} />
                                    Можно с животными
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={formData.allowSmoking} onChange={() => handleCheckbox('allowSmoking')} />
                                    Можно курить
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* === ОПИСАНИЕ И ОСОБЕННОСТИ === */}
                    <div className="form-section">
                        <h3 className="section-title">Описание и особенности</h3>
                        <div className="form-group">
                            <label className="form-label">Особенности (теги)</label>
                            <div className="feature-input-wrapper">
                                <input type="text" value={formData.newFeature} onChange={(e) => setFormData(prev => ({ ...prev, newFeature: e.target.value }))} onKeyDown={handleKeyDown} className="form-input" placeholder="Добавьте и нажмите Enter" />
                                <button type="button" onClick={handleFeatureAdd} className="add-feature-btn">+</button>
                            </div>
                            {formData.features.length > 0 && (
                                <div className="features-list">
                                    {formData.features.map((f, i) => (
                                        <span key={i} className="feature-tag">
                      {f}
                                            <button type="button" onClick={() => handleFeatureRemove(f)} className="feature-remove">×</button>
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Подробное описание</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required className="form-textarea" placeholder="Расскажите о квартире..." rows={4} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Удобства (через запятую)</label>
                            <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="form-input" placeholder="Wi-Fi, Кондиционер, Стиральная машина" />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            {editMode ? 'Сохранить изменения' : 'Опубликовать'}
                        </button>
                        <button type="button" onClick={editMode && onCancel ? onCancel : () => navigate('/')} className="cancel-btn">
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;