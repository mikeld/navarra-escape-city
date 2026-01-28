
import { Character } from '../types';

export const CHARACTERS: Record<string, Character> = {
    sancho_fuerte: {
        id: 'sancho_fuerte',
        name: 'Sancho VII el Fuerte',
        role: 'Rey de Navarra',
        bio: 'Rey de Navarra conocido por su enorme estatura y su papel heroico en las Navas de Tolosa.',
        image: '/assets/characters/sancho.jpg',
        storageUrl: 'assets/characters/sancho.jpg',
        category: 'Realeza'
    },
    carlos_noble: {
        id: 'carlos_noble',
        name: 'Carlos III el Noble',
        role: 'Rey de Navarra',
        bio: 'Rey que transformó Navarra, constructor del Palacio de Olite y amante de la cultura.',
        image: '/assets/characters/carlos.jpg',
        storageUrl: 'assets/characters/carlos.jpg',
        category: 'Realeza'
    },
    blanca_navarra: {
        id: 'blanca_navarra',
        name: 'Blanca I de Navarra',
        role: 'Reina de Navarra',
        bio: 'Reina propietaria que consolidó alianzas y mantuvo el esplendor de la corte.',
        image: '/assets/characters/blanca.jpg',
        storageUrl: 'assets/characters/blanca.jpg',
        category: 'Realeza'
    }
};
