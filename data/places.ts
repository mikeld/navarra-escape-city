
import { Place } from '../types';

export type PlaceWithKeys = Place & { nameKey: string; descKey: string };

export const PLACES_INFO: PlaceWithKeys[] = [
    {
        id: 'estella_lizarra',
        name: 'Estella-Lizarra',
        nameKey: 'games.estella.title',
        description: 'La Ciudad del Ega, joya del románico y parada clave del Camino de Santiago.',
        descKey: 'placesInfo.estella.desc',
        image: '/assets/destinos/estella.jpg',
        category: 'Civil',
        storageUrl: 'assets/destinos/estella.jpg'
    },
    {
        id: 'olite_erriberri',
        name: 'Olite / Erriberri',
        nameKey: 'games.olite.title',
        description: 'Sede de la Corte de los Reyes de Navarra y su majestuoso Palacio Real.',
        descKey: 'placesInfo.olite.desc',
        image: '/assets/destinos/olite.jpg',
        category: 'Civil',
        storageUrl: 'assets/destinos/olite.jpg'
    },
    {
        id: 'bardenas_reales',
        name: 'Bardenas Reales',
        nameKey: 'placesInfo.bardenas.name',
        description: 'Un desierto de arcilla y piedra con formas erosionadas únicas en Europa. Parque Natural y Reserva de la Biosfera.',
        descKey: 'placesInfo.bardenas.desc',
        image: '/assets/destinos/bardenas.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/bardenas.jpg'
    },
    {
        id: 'selva_irati',
        name: 'Selva de Irati',
        nameKey: 'placesInfo.irati.name',
        description: 'El segundo bosque de hayas y abetos más grande de Europa, un mar verde de cuento en el corazón del Pirineo navarro.',
        descKey: 'placesInfo.irati.desc',
        image: '/assets/destinos/irati.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/irati.jpg'
    },
    {
        id: 'roncesvalles',
        name: 'Roncesvalles',
        nameKey: 'placesInfo.roncesvalles.name',
        description: 'Puerta de entrada a España del Camino de Santiago y escenario de la legendaria batalla de Roldán y Carlomagno.',
        descKey: 'placesInfo.roncesvalles.desc',
        image: '/assets/destinos/roncesvalles.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/roncesvalles.jpg'
    },
    {
        id: 'castillo_javier',
        name: 'Castillo de Javier',
        nameKey: 'placesInfo.javier.name',
        description: 'Fortaleza medieval cuna de San Francisco Javier, Patrón de Navarra. Destino de la Javierada, la peregrinación más multitudinaria de Navarra.',
        descKey: 'placesInfo.javier.desc',
        image: '/assets/destinos/javier.jpg',
        category: 'Militar',
        storageUrl: 'assets/destinos/javier.jpg'
    },
    {
        id: 'monasterio_leyre',
        name: 'Monasterio de Leyre',
        nameKey: 'placesInfo.leyre.name',
        description: 'Panteón de los primeros Reyes de Navarra, uno de los monumentos más bellos del románico peninsular, encaramado sobre el Pirineo con vistas al embalse de Yesa.',
        descKey: 'placesInfo.leyre.desc',
        image: '/assets/destinos/leyre.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/leyre.jpg'
    },
    {
        id: 'puente_la_reina',
        name: 'Puente la Reina',
        nameKey: 'placesInfo.puentereina.name',
        description: 'El puente románico más famoso del Camino de Santiago, construido por orden de una reina navarra para los peregrinos. Aquí confluyen los dos caminos jacobeos de España.',
        descKey: 'placesInfo.puentereina.desc',
        image: '/assets/destinos/puente_la_reina.jpg',
        category: 'Civil',
        storageUrl: 'assets/destinos/puente_la_reina.jpg'
    },
    {
        id: 'valle_baztan',
        name: 'Valle de Baztán',
        nameKey: 'placesInfo.baztan.name',
        description: 'El valle más mágico del norte de Navarra, tierra de caseríos, brujas y tradiciones milenarias entre montañas verdes y ríos cristalinos.',
        descKey: 'placesInfo.baztan.desc',
        image: '/assets/destinos/baztan.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/baztan.jpg'
    },
    {
        id: 'urbasa_andia',
        name: 'Sierra de Urbasa y Andía',
        nameKey: 'placesInfo.urbasa.name',
        description: 'Meseta kárstica de bosques milenarios, dolmenes y manantiales. El nacimiento del río Urederra aquí es uno de los paisajes más hermosos de Navarra.',
        descKey: 'placesInfo.urbasa.desc',
        image: '/assets/destinos/urbasa.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/urbasa.jpg'
    }
];
