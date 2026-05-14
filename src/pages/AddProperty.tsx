import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';
import type { Property, HouseType, BathroomType } from '../types';

interface AddPropertyProps {
    editMode?: boolean;
    propertyData?: Property;
    onSubmit?: (Omit<Property, 'id' | 'createdAt' | 'authorId' | 'images' | 'image'>);
    onCancel?: () => void;
}

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
    uploaded: boolean;
    progress: number;
}

const AddProperty: React.FC<AddPropertyProps> = ({
                                                     editMode = false,
                                                     propertyData,
                                                     onSubmit,
                                                     onCancel
                                                 }) => {
    const navigate = useNavigate();
    const { addProperty, editProperty, currentUser } = useApp();

    // Состояние формы
    const [formData, setFormData] = useState({
        title: '', price: '', area: '', rooms: '', floor: '', description: '', address: '', metro: '',
        category: 'apartment' as const, amenities: '',
        minutesToMetro: '',
        houseType: 'monolith' as HouseType,
        bathroom: 'combined' as BathroomType,
        elevatorPassenger: false,
        elevatorCargo: false,
        deposit: '',
        utilitiesIncluded: false,
        allowChildren: true,
        allowPets: false,
        allowSmoking: false,
        features: [] as string[],
        newFeature: ''
    });

    // Состояние загрузки фото
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Заполнение формы при редактировании
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
                elevatorPassenger: propertyData.elevator.passenger,
                elevatorCargo: propertyData.elevator.cargo,
                deposit: String(propertyData.deposit || ''),
                utilitiesIncluded: propertyData.utilitiesIncluded,
                allowChildren: propertyData.rules.children,
                allowPets: propertyData.rules.pets,
                allowSmoking: propertyData.rules.smoking,
                features: propertyData.features || [],
                newFeature: ''
            });
            // Загружаем существующие фото как превью
            if (propertyData.images?.length) {
                const existingImages: UploadedImage[] = propertyData.images.map((src, idx) => ({
                    id: `existing-${idx}`,
                    file: new File([], 'existing.jpg'),
                    preview: src,
                    uploaded: true,
                    progress: 100
                }));
                setImages(existingImages);
            }
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
                    <Link to="/profile" className="search-btn" style={{ textDecoration: 'none' }}>Войти в аккаунт</Link>
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

    // === ЗАГРУЗКА ФОТОГРАФИЙ ===
    const validateFiles = (files: FileList | File[]): File[] => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 10 * 1024 * 1024; // 10 МБ
        const validFiles: File[] = [];

        Array.from(files).forEach(file => {
            if (!validTypes.includes(file.type)) {
                alert(`Файл "${file.name}" не поддерживается. Разрешены только JPEG и PNG.`);
                return;
            }
            if (file.size > maxSize) {
                alert(`Файл "${file.name}" слишком большой. Максимальный размер: 10 МБ.`);
                return;
            }
            validFiles.push(file);
        });

        return validFiles;
    };

    const createImagePreview = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });
    };

    // ИСПРАВЛЕННАЯ ФУНКЦИЯ СИМУЛЯЦИИ ЗАГРУЗКИ
    const simulateUpload = async (image: UploadedImage): Promise<UploadedImage> => {
        return new Promise((resolve) => {
            let progress = 0;

            // Обновляем состояние прогресса внутри интервала
            const updateProgress = (p: number) => {
                setImages(prev => prev.map(img => img.id === image.id ? { ...img, progress: p } : img));
            };

            const interval = setInterval(() => {
                progress += Math.random() * 20 + 10; // Шаг 10-30%
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    // ИСПРАВЛЕНИЕ: обновляем состояние, явно ставя uploaded: true
                    setImages(prev => prev.map(img =>
                        img.id === image.id ? { ...img, progress: 100, uploaded: true } : img
                    ));
                    resolve({ ...image, uploaded: true, progress: 100 });
                } else {
                    updateProgress(progress);
                    // ВАЖНО: Здесь нет resolve(), иначе промис завершится раньше времени
                }
            }, 200);
        });
    };

    const handleFileSelect = async (files: FileList | File[]) => {
        const validFiles = validateFiles(files);
        if (!validFiles.length) return;

        setIsUploading(true);

        for (const file of validFiles) {
            const preview = await createImagePreview(file);
            const newImage: UploadedImage = {
                id: `upload-${Date.now()}-${Math.random()}`,
                file,
                preview,
                uploaded: false,
                progress: 0
            };

            // 1. Добавляем пустое изображение в список, чтобы пользователь сразу его увидел
            setImages(prev => [...prev, newImage]);

            // 2. Запускаем симуляцию (которая обновляет прогресс-бар внутри себя)
            await simulateUpload(newImage);
        }

        setIsUploading(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeImage = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Получаем URL загруженных фото (base64 превью)
        const imageUrls = images.map(img => img.preview);
        const mainImage = imageUrls[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800';

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
            image: mainImage,
            images: imageUrls,
            amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
            deposit: Number(formData.deposit) || 0,
            minutesToMetro: Number(formData.minutesToMetro) || 0,
            houseType: formData.houseType,
            elevator: {
                passenger: formData.elevatorPassenger,
                cargo: formData.elevatorCargo
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
        } else if (editMode && editProperty && propertyData) {
            editProperty(propertyData.id, propertyPayload);
            navigate('/profile');
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
                            <select name="category" value={formData.category} onChange={handleChange} className="form-select select">
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
                                <select name="rooms" value={formData.rooms} onChange={handleChange} required className="form-select select">
                                    <option value="" disabled >Выберите</option>
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

                    {/* === ФОТОГРАФИИ === */}
                    <div className="form-section">
                        <h3 className="section-title">Фотографии</h3>

                        <div
                            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <input
                                type="file"
                                id="photo-upload"
                                accept="image/jpeg,image/png,image/jpg"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                            />

                            <div className="upload-zone-content">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b21a8" strokeWidth="1.5">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                                </svg>
                                <p className="upload-text">Перетащите фотографии сюда</p>
                                <p className="upload-hint">или</p>
                                <label htmlFor="photo-upload" className="upload-btn">
                                    Выбрать файлы
                                </label>
                                <p className="upload-formats">JPEG, PNG • до 10 МБ</p>
                            </div>
                        </div>

                        {/* Превью загруженных фото */}
                        {images.length > 0 && (
                            <div className="uploaded-images">
                                {images.map((img) => (
                                    <div key={img.id} className="uploaded-image-item">
                                        <img src={img.preview} alt="preview" className="uploaded-image" />

                                        {/* Индикатор загрузки */}
                                        {!img.uploaded && (
                                            <div className="upload-progress-overlay">
                                                <div className="upload-progress-bar">
                                                    <div
                                                        className="upload-progress-fill"
                                                        style={{ width: `${img.progress}%` }}
                                                    />
                                                </div>
                                                <span className="upload-progress-text">{Math.round(img.progress)}%</span>
                                            </div>
                                        )}

                                        {/* Галочка успешной загрузки */}
                                        {img.uploaded && (
                                            <div className="upload-success-badge">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                    <path d="M20 6L9 17l-5-5"/>
                                                </svg>
                                            </div>
                                        )}

                                        {/* Кнопка удаления */}
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => removeImage(img.id)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                <select name="houseType" defaultValue="" value={formData.houseType} onChange={handleChange} className="form-select select">
                                    <option value="" disabled>Выберите</option>
                                    <option value="brick">Кирпич</option>
                                    <option value="panel">Панель</option>
                                    <option value="monolith">Монолит</option>
                                    <option value="wood">Дерево</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Санузел</label>
                                <select name="bathroom" value={formData.bathroom} onChange={handleChange} className="form-select select">
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
                        <button type="submit" className="submit-btn" disabled={isUploading}>
                            {isUploading ? 'Загрузка фото...' : editMode ? 'Сохранить изменения' : 'Опубликовать'}
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