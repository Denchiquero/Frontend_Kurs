import type { Property } from '../types';

export const mockProperties: Property[] = [
    // 1. КВАРТИРА В ЦЕНТРЕ (Тверская)
    {
        id: 1,
        title: 'Светлая 2-комнатная квартира у Тверской',
        price: 120000,
        area: 58,
        rooms: '2',
        floor: '7/12',
        description: 'Просторная квартира с ремонтом в сталинском доме. Высокие потолки, тихий двор, развитая инфраструктура. Рядом метро, магазины, рестораны.',
        address: 'ул. Тверская, д. 18, стр. 1',
        metro: 'Тверская',
        image: 'https://vladis.ru/_next/image?url=https%3A%2F%2F36000382-a1c2-4a8a-a109-3fc3bfc73cf7.selcdn.net%2FApp%2FEntity%2FObjectRealty%2FObjectRealty%2FJG%2F2d83bcfc-60f8-4457-bcab-f56126bb78b7%2FKKRmJvDAVO4eAhMO2t0k2LEnLAqvV2L2HDtGTnxH.jpg.652_468.webp&w=3840&q=75',
        images: [
            'https://vladis.ru/_next/image?url=https%3A%2F%2F36000382-a1c2-4a8a-a109-3fc3bfc73cf7.selcdn.net%2FApp%2FEntity%2FObjectRealty%2FObjectRealty%2FJG%2F2d83bcfc-60f8-4457-bcab-f56126bb78b7%2FKKRmJvDAVO4eAhMO2t0k2LEnLAqvV2L2HDtGTnxH.jpg.652_468.webp&w=3840&q=75',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
            'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800'
        ],
        category: 'apartment',
        amenities: ['Wi-Fi', 'Кондиционер', 'Стиральная машина', 'Посудомоечная машина'],
        createdAt: '2024-01-10',
        authorId: 1,
        deposit: 120000,
        minutesToMetro: 3,
        houseType: 'brick',
        elevator: { passenger: true, cargo: false },
        bathroom: 'separate',
        utilitiesIncluded: false,
        rules: { children: true, pets: false, smoking: false },
        features: ['Высокие потолки', 'Тихий двор', 'Ремонт 2023', 'Балкон']
    },

    // 2. КОТТЕДЖ В НОВОЙ МОСКВЕ (Коммунарка)
    {
        id: 2,
        title: 'Коттедж в Говорово с участком',
        price: 180000,
        area: 160,
        rooms: '5',
        floor: '2',
        description: 'Уютный коттедж в тихом районе Новой Москвы. Собственный участок 6 соток, гараж на 2 машины, терраса. Идеально для семьи.',
        address: 'пос. Говорово, ул. 50 лет Октября, д. 3',
        metro: 'Говорово',
        image: 'https://holz-house.ru/userfiles/blog/2021/derevenskiy/Blog-derevenskiy-stil-1300x650-02.jpg',
        images: [
            'https://holz-house.ru/userfiles/blog/2021/derevenskiy/Blog-derevenskiy-stil-1300x650-02.jpg',
            'https://images.unsplash.com/photo-1564013799919-ab39cf56b4c1?w=800',
            'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800'
        ],
        category: 'house',
        amenities: ['Wi-Fi', 'Кондиционер', 'Умный дом', 'Парковка'],
        createdAt: '2024-01-12',
        authorId: 1,
        deposit: 100000,
        minutesToMetro: 15,
        houseType: 'brick',
        elevator: { passenger: false, cargo: false }, // Нет лифта в частном доме!
        bathroom: 'separate',
        utilitiesIncluded: false,
        rules: { children: true, pets: true, smoking: false },
        features: ['Участок 6 соток', 'Гараж', 'Терраса', 'Камин', 'Баня']
    },

    // 3. СТУДИЯ У МГУ (Ломоносовский)
    {
        id: 3,
        title: 'Стильная студия для студентов у МГУ',
        price: 55000,
        area: 26,
        rooms: 'Студия',
        floor: '4/9',
        description: 'Светлая студия с современным ремонтом. Полностью укомплектована мебелью и техникой. Идеально для студента или аспиранта.',
        address: 'Ломоносовский проспект, д. 27, корп. 2',
        metro: 'Ломоносовский проспект',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBX1ZrpTNVThgulM2P9Z5BM5osO_N7j_7eFQ&s',
        images: [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBX1ZrpTNVThgulM2P9Z5BM5osO_N7j_7eFQ&s',
            'https://images.unsplash.com/photo-1502005229766-3c8ef95a5d78?w=800'
        ],
        category: 'studio',
        amenities: ['Wi-Fi', 'Стиральная машина', 'Холодильник'],
        createdAt: '2024-01-15',
        authorId: 2,
        deposit: 0, // Без залога для студентов
        minutesToMetro: 5,
        houseType: 'panel',
        elevator: { passenger: true, cargo: false },
        bathroom: 'combined',
        utilitiesIncluded: true,
        rules: { children: false, pets: false, smoking: false },
        features: ['Мебель', 'Техника', 'Рядом МГУ', 'Тихий двор']
    },

    // 4. ГАРАЖ/МАШИНОМЕСТО (Парк Победы)
    {
        id: 4,
        title: 'Отапливаемый гараж с ямой',
        price: 15000,
        area: 24,
        rooms: '1',
        floor: '1',
        description: 'Сухой отапливаемый гараж в охраняемом кооперативе. Смотровая яма, электричество 380В, автоматические ворота. Круглосуточная охрана.',
        address: 'ул. Барклая, вл. 6, ГСК "Парк"',
        metro: 'Парк Победы',
        image: 'https://s0.rbk.ru/v6_top_pics/media/img/7/83/756235179223837.jpg',
        images: [
            'https://s0.rbk.ru/v6_top_pics/media/img/7/83/756235179223837.jpg',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800'
        ],
        category: 'commercial',
        amenities: ['Охрана', 'Электричество 380В', 'Автоворота'],
        createdAt: '2024-01-18',
        authorId: 3,
        deposit: 15000,
        minutesToMetro: 8,
        houseType: 'brick',
        elevator: { passenger: false, cargo: false },
        bathroom: 'separate',
        utilitiesIncluded: true,
        rules: { children: false, pets: false, smoking: true },
        features: ['Отапливаемый', 'Смотровая яма', 'Охрана 24/7', 'Автоворота']
    },

    // 5. КВАРТИРА В МОСКВА-СИТИ (Башня Федерация)
    {
        id: 5,
        title: 'Апартаменты с видом на Москва-Сити',
        price: 250000,
        area: 75,
        rooms: '2',
        floor: '42/65',
        description: 'Роскошные апартаменты на высоком этаже с панорамным видом на город. Премиальная отделка, умный дом, консьерж-сервис.',
        address: 'Пресненская набережная, д. 12, Башня "Федерация"',
        metro: 'Выставочная',
        image: 'https://www.loft2rent.ru/upload_data/2025/379/uplda0IceX.jpg.900x600.jpg',
        images: [
            'https://www.loft2rent.ru/upload_data/2025/379/uplda0IceX.jpg.900x600.jpg',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'
        ],
        category: 'apartment',
        amenities: ['Wi-Fi', 'Кондиционер', 'Умный дом', 'Фитнес-клуб', 'Паркинг'],
        createdAt: '2024-01-20',
        authorId: 1,
        deposit: 250000,
        minutesToMetro: 2,
        houseType: 'monolith',
        elevator: { passenger: true, cargo: true }, // И пассажирский, и грузовой в небоскрёбе
        bathroom: 'separate',
        utilitiesIncluded: false,
        rules: { children: false, pets: false, smoking: false },
        features: ['Панорамный вид', '42 этаж', 'Консьерж', 'Фитнес', 'Бассейн']
    },

    // 6. ТАУНХАУС В БУТОВО (Южное Бутово)
    {
        id: 6,
        title: 'Таунхаус с садом в Южном Бутово',
        price: 95000,
        area: 110,
        rooms: '4',
        floor: '3',
        description: 'Современный таунхаус в закрытом коттеджном посёлке. Собственный палисадник, парковка, детская площадка. Тихий зелёный район.',
        address: 'ул. Адмирала Лазарева, д. 52, к. 1',
        metro: 'Улица Горчакова',
        image: 'https://storage.yandexcloud.net/nav-media/c/pc/p/cti/cebcaebecaecd8449e873ea162951bb5f961d9ef/97c14262900592fb9e08f408e11c87e5.jfif',
        images: [
            'https://storage.yandexcloud.net/nav-media/c/pc/p/cti/cebcaebecaecd8449e873ea162951bb5f961d9ef/97c14262900592fb9e08f408e11c87e5.jfif',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
        ],
        category: 'house',
        amenities: ['Wi-Fi', 'Кондиционер', 'Парковка', 'Детская площадка'],
        createdAt: '2024-01-22',
        authorId: 2,
        deposit: 95000,
        minutesToMetro: 10,
        houseType: 'brick',
        elevator: { passenger: false, cargo: false }, // Нет лифта в таунхаусе!
        bathroom: 'separate',
        utilitiesIncluded: false,
        rules: { children: true, pets: true, smoking: false },
        features: ['Сад', 'Парковка', 'Закрытый посёлок', 'Детская площадка']
    }
];

export const categories = [
    { id: 'apartment', label: 'Квартира' },
    { id: 'house', label: 'Дом' },
    { id: 'studio', label: 'Студия' },
    { id: 'commercial', label: 'Коммерческая недвижимость' }
];