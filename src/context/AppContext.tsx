import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Property, User } from '../types';
import { mockProperties } from '../data/mockData';

interface AppContextType {
    properties: Property[];
    favorites: number[];
    currentUser: User | null;
    addFavorite: (id: number) => void;
    removeFavorite: (id: number) => void;
    deleteProperty: (id: number) => void;
    editProperty: (id: number, property: Partial<Property>) => void;
    isFavorite: (id: number) => boolean;
    addProperty: (property: {
        title: string;
        price: number;
        area: number;
        rooms: string;
        floor: string;
        description: string;
        address: string;
        metro: string;
        category: string;
        image: string;
        images: string[];
        amenities: string[];
        deposit: number;
        minutesToMetro: number;
        houseType: string;
        elevator: { passenger: number; cargo: number };
        bathroom: string;
        utilitiesIncluded: boolean;
        rules: { children: boolean; pets: boolean; smoking: boolean };
        features: any[]
    }) => void;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 1. Читаем из localStorage при первом рендере (ленивая инициализация)
    const [properties, setProperties] = useState<Property[]>(() => {
        try {
            const saved = localStorage.getItem('app_properties');
            return saved ? JSON.parse(saved) : mockProperties;
        } catch {
            return mockProperties;
        }
    });

    const [favorites, setFavorites] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem('app_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem('app_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // 2. Сохраняем изменения в localStorage сразу при обновлении стейта
    const addFavorite = (id: number) => {
        const updated = [...favorites, id];
        setFavorites(updated);
        localStorage.setItem('app_favorites', JSON.stringify(updated));
    };

    const removeFavorite = (id: number) => {
        const updated = favorites.filter(f => f !== id);
        setFavorites(updated);
        localStorage.setItem('app_favorites', JSON.stringify(updated));
    };

    const isFavorite = (id: number) => favorites.includes(id);

    const addProperty = (property: Omit<Property, 'id' | 'createdAt'>) => {
        const newProperty: Property = {
            ...property,
            id: Date.now(),
            createdAt: new Date().toISOString().split('T')[0],
            authorId: currentUser?.id
        };
        const updated = [newProperty, ...properties];
        setProperties(updated);
        localStorage.setItem('app_properties', JSON.stringify(updated));
    };

    const deleteProperty = (id: number) => {
        const updated = properties.filter(p => p.id !== id);
        setProperties(updated);
        localStorage.setItem('app_properties', JSON.stringify(updated));
    };

    const editProperty = (id: number, property: Partial<Property>) => {
        const updated = properties.map(p =>
            p.id === id ? { ...p, ...property } : p
        );
        setProperties(updated);
        localStorage.setItem('app_properties', JSON.stringify(updated));
    };

    const login = (email: string, password: string): boolean => {
        if (email && password) {
            const user: User = {
                id: 1,
                name: 'Иван Иванов',
                email: email,
                phone: '+7 (999) 123-45-67'
            };
            setCurrentUser(user);
            localStorage.setItem('app_user', JSON.stringify(user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        setFavorites([]);
        // Очищаем только сессию и избранное. Объявления остаются глобальными.
        localStorage.removeItem('app_user');
        localStorage.removeItem('app_favorites');
    };

    return (
        <AppContext.Provider value={{
            properties,
            favorites,
            currentUser,
            addFavorite,
            removeFavorite,
            isFavorite,
            addProperty,
            editProperty,  // <-- добавьте эту строку
            login,
            logout,
            deleteProperty
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};