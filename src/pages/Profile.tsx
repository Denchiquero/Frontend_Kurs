import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';
import AddProperty from './AddProperty';

const Profile: React.FC = () => {
    const { properties, currentUser, login, logout, deleteProperty, editProperty } = useApp();
    const myProperties = currentUser ? properties.filter(p => p.authorId === currentUser.id) : [];
    const [, setIsLoginMode] = useState(!currentUser);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [editingProperty, setEditingProperty] = useState<any>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(email, password);
        if (success) {
            setIsLoginMode(false);
            setError('');
        } else {
            setError('Ошибка входа');
        }
    };

    const handleEdit = (property: any) => {
        setEditingProperty(property);
    };

    const handleDelete = (propertyId: number) => {
        deleteProperty(propertyId);
    };

    const handleEditSubmit = (updatedData: any) => {
        if (editingProperty) {
            editProperty(editingProperty.id, updatedData);
            setEditingProperty(null);
        }
    };

    if (!currentUser) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h2 className="login-title">Вход в личный кабинет</h2>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Пароль</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            Войти
                        </button>
                    </form>

                    <p className="login-hint">
                        Для демонстрации введите любые данные
                    </p>
                </div>
            </div>
        );
    }

    if (editingProperty) {
        return (
            <div className="container">
                <button
                    onClick={() => setEditingProperty(null)}
                    className="back-btn"
                    style={{ marginBottom: '24px' }}
                >
                    ← Назад к профилю
                </button>
                <AddProperty
                    editMode={true}
                    propertyData={editingProperty}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setEditingProperty(null)}
                />
            </div>
        );
    }

    return (
        <div className="home-wrapper">
            <div className="profile-card">
                <div className="profile-header">
                    <h1 className="page-title" style={{ marginBottom: 0 }}>Профиль</h1>
                    <button onClick={logout} className="logout-btn">
                        Выйти
                    </button>
                </div>

                <div className="profile-content">
                    <div className="profile-avatar">
                        <div className="avatar">
                            {currentUser.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="profile-name">{currentUser.name}</h2>
                            <p className="profile-email">{currentUser.email}</p>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h3 className="section-title">Мои объявления ({myProperties.length})</h3>
                        {myProperties.length === 0 ? (
                            <p className="section-text">Вы пока ничего не разместили</p>
                        ) : (
                            <div className="properties-grid" style={{ marginTop: '20px' }}>
                                {myProperties.map(prop => (
                                    <PropertyCard
                                        key={prop.id}
                                        property={prop}
                                        showMenu={true}
                                        onEdit={() => handleEdit(prop)}
                                        onDelete={() => handleDelete(prop.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;