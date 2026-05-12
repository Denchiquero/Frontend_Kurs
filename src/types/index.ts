export type HouseType = 'brick' | 'panel' | 'wood' | 'monolith';
export type BathroomType = 'combined' | 'separate';

export interface Property {
    id: number;
    title: string;
    price: number;
    area: number;
    rooms: string;
    floor: string;
    description: string; // Текстовое описание
    address: string;
    metro: string;
    image: string;
    images: string[];
    category: 'apartment' | 'house' | 'studio' | 'commercial';
    amenities: string[];
    createdAt: string;
    authorId?: number;

    // Структурированные характеристики
    deposit: number; // Сумма залога (0 если нет)
    minutesToMetro: number;
    houseType: HouseType;
    elevator: {
        passenger: number;
        cargo: number;
    };
    bathroom: BathroomType;
    utilitiesIncluded: boolean; // ЖКУ включены в стоимость
    rules: {
        children: boolean;
        pets: boolean;
        smoking: boolean;
    };
    features: string[]; // Теги особенностей (Кухня 10 м², Шлагбаум и т.д.)
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
}