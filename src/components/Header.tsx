import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
    const location = useLocation();
    const { currentUser } = useApp(); // logout остался только на странице профиля

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    Снять.ру
                </Link>

                <nav className="nav">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Главная</Link>
                    <Link to="/add" className={`nav-link ${isActive('/add') ? 'active' : ''}`}>Добавить объявление</Link>
                    <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>Избранное</Link>
                    {/* Кнопка "Профиль" убрана */}
                </nav>

                <div className="user-menu">
                    {currentUser ? (
                        <Link to="/profile" className="avatar-link">
                            <div className="avatar-circle">
                                {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                        </Link>
                    ) : (
                        <Link to="/profile" className="login-btn">
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;