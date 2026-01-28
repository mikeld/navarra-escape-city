
import { Place } from '../types';

export type PlaceWithKeys = Place & { nameKey: string; descKey: string };

export const PLACES_INFO: PlaceWithKeys[] = [
    {
        id: 'estella_lizarra',
        name: 'Estella-Lizarra',
        nameKey: 'games.estella.title',
        description: 'La Ciudad del Ega, joya del románico y parada clave del Camino de Santiago.',
        descKey: 'games.estella.desc',
        image: '/assets/destinos/estella.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/estella.jpg'
    },
    {
        id: 'olite_erriberri',
        name: 'Olite / Erriberri',
        nameKey: 'games.olite.title',
        description: 'Sede de la Corte de los Reyes de Navarra y su majestuoso Palacio Real.',
        descKey: 'games.olite.desc',
        image: '/assets/destinos/olite.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/olite.jpg'
    },
    {
        id: 'tafalla',
        name: 'Tafalla',
        nameKey: 'games.tafalla.title',
        description: 'La ciudad del Cidacos, centro neurálgico de la Zona Media.',
        descKey: 'games.tafalla.desc',
        image: '/assets/destinos/tafalla.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/tafalla.jpg'
    }
];
