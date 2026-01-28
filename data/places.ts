
import { Place } from '../types';

export type PlaceWithKeys = Place & { nameKey: string; descKey: string };

export const PLACES_INFO: PlaceWithKeys[] = [
    {
        id: 'palacio_real_torre',
        name: 'Palacio Real - Torre del Homenaje',
        nameKey: 'places.palacio_real_torre.name',
        description: 'La torre más alta del Palacio, donde nacen las leyendas de la música del viento.',
        descKey: 'places.palacio_real_torre.desc',
        image: '/assets/places/palacio_real.jpg',
        category: 'Civil',
        storageUrl: 'assets/places/palacio_real.png'
    },
    {
        id: 'santa_maria_real',
        name: 'Iglesia de Santa María la Real',
        nameKey: 'places.santa_maria_real.name',
        description: 'Gótico navarro en su máxima expresión con un portal lleno de historias cifradas.',
        descKey: 'places.santa_maria_real.desc',
        image: '/assets/places/santa_maria.jpg',
        category: 'Religioso',
        storageUrl: 'assets/places/santa_maria.png'
    },
    {
        id: 'san_pedro_navarra',
        name: 'Iglesia de San Pedro',
        nameKey: 'places.san_pedro_navarra.name',
        description: 'Famosa por su claustro y la torre románica que domina el horizonte.',
        descKey: 'places.san_pedro_navarra.desc',
        image: '/assets/places/san_pedro.jpg',
        category: 'Religioso',
        storageUrl: 'assets/places/san_pedro.png'
    },
    {
        id: 'murallas_navarra',
        name: 'Murallas de Navarra',
        nameKey: 'places.murallas_navarra.name',
        description: 'Restos de la antigua fortificación romana y medieval.',
        descKey: 'places.murallas_navarra.desc',
        image: '/assets/places/murallas.jpg',
        category: 'Militar',
        storageUrl: 'assets/places/murallas.png'
    },
    {
        id: 'galeria_reyes',
        name: 'Galería de los Reyes',
        nameKey: 'places.galeria_reyes.name',
        description: 'Un espacio majestuoso donde los ecos del pasado aún resuenan.',
        descKey: 'places.galeria_reyes.desc',
        image: '/assets/places/galeria_reyes.jpg',
        category: 'Civil',
        storageUrl: 'assets/places/galeria_reyes.png'
    }
];
