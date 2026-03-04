
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
    },
    // Los 25 Tesoros de Navarra
    {
        id: 'palacio_olite',
        name: 'Palacio Real de Olite',
        nameKey: 'placesInfo.palacioOlite.name',
        description: 'Uno de los conjuntos civiles góticos más interesantes de Europa, sede de los reyes navarros y destaca por su silueta de torres caprichosas y jardines.',
        descKey: 'placesInfo.palacioOlite.desc',
        image: '/assets/destinos/olite.jpg',
        category: 'Civil',
        storageUrl: 'assets/destinos/olite.jpg'
    },
    {
        id: 'nacedero_urederra',
        name: 'Nacedero del Urederra',
        nameKey: 'placesInfo.urederra.name',
        description: 'Reserva natural en la sierra de Urbasa conocida por sus pozas de aguas de un azul turquesa intenso y su frondoso bosque de hayas.',
        descKey: 'placesInfo.urederra.desc',
        image: '/assets/destinos/urbasa.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/urbasa.jpg'
    },
    {
        id: 'catedral_pamplona',
        name: 'Catedral de Pamplona',
        nameKey: 'placesInfo.catedralPamplona.name',
        description: 'El conjunto gótico más importante de Navarra; su claustro es reconocido como uno de los más exquisitos del gótico universal.',
        descKey: 'placesInfo.catedralPamplona.desc',
        image: '/assets/destinos/pamplona.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/pamplona.jpg'
    },
    {
        id: 'catedral_tudela',
        name: 'Catedral de Tudela',
        nameKey: 'placesInfo.catedralTudela.name',
        description: 'Monumento nacional construido en el siglo XII sobre una antigua mezquita, famoso por su espectacular Puerta del Juicio Final.',
        descKey: 'placesInfo.catedralTudela.desc',
        image: '/assets/destinos/tudela.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/tudela.jpg'
    },
    {
        id: 'colegiata_roncesvalles',
        name: 'Real Colegiata de Roncesvalles',
        nameKey: 'placesInfo.colegiataRoncesvalles.name',
        description: 'Hito fundamental del Camino de Santiago y joya del gótico francés, alberga la tumba del rey Sancho VII el Fuerte.',
        descKey: 'placesInfo.colegiataRoncesvalles.desc',
        image: '/assets/destinos/roncesvalles.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/roncesvalles.jpg'
    },
    {
        id: 'foz_lumbier',
        name: 'Foz de Lumbier',
        nameKey: 'placesInfo.fozLumbier.name',
        description: 'Estrecha garganta labrada por el río Irati, donde se pueden avistar buitres leonados sobrevolando sus imponentes paredes rojizas.',
        descKey: 'placesInfo.fozLumbier.desc',
        image: '/assets/destinos/bardenas.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/bardenas.jpg'
    },
    {
        id: 'foz_arbayun',
        name: 'Foz de Arbayún',
        nameKey: 'placesInfo.fozArbayun.name',
        description: 'La más extensa e impresionante de las gargantas navarras, reserva natural con paredes verticales de casi 6 kilómetros de longitud.',
        descKey: 'placesInfo.fozArbayun.desc',
        image: '/assets/destinos/bardenas.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/bardenas.jpg'
    },
    {
        id: 'eunate',
        name: 'Iglesia de Eunate',
        nameKey: 'placesInfo.eunate.name',
        description: 'Templo románico de planta octogonal rodeado por un claustro exterior, envuelto en un aura de misterio y leyenda en el corazón del Camino de Santiago.',
        descKey: 'placesInfo.eunate.desc',
        image: '/assets/destinos/puente_la_reina.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/puente_la_reina.jpg'
    },
    {
        id: 'cerco_artajona',
        name: 'Cerco de Artajona',
        nameKey: 'placesInfo.cercoArtajona.name',
        description: 'La fortificación popular medieval más importante de la Zona Media, con un recinto amurallado del siglo XI que conserva nueve torreones.',
        descKey: 'placesInfo.cercoArtajona.desc',
        image: '/assets/destinos/estella.jpg',
        category: 'Militar',
        storageUrl: 'assets/destinos/estella.jpg'
    },
    {
        id: 'monasterio_oliva',
        name: 'Monasterio de la Oliva',
        nameKey: 'placesInfo.monasterioOliva.name',
        description: 'Ejemplo genuino del arte cisterciense en España, con una amplia iglesia y un claustro gótico que invitan a la meditación.',
        descKey: 'placesInfo.monasterioOliva.desc',
        image: '/assets/destinos/leyre.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/leyre.jpg'
    },
    {
        id: 'sierra_aralar',
        name: 'Sierra de Aralar',
        nameKey: 'placesInfo.aralar.name',
        description: 'Gran macizo kárstico que combina paisajes de valles ciegos y cuevas con prados siempre verdes y dólmenes prehistóricos.',
        descKey: 'placesInfo.aralar.desc',
        image: '/assets/destinos/urbasa.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/urbasa.jpg'
    },
    {
        id: 'murallas_pamplona',
        name: 'Murallas de Pamplona',
        nameKey: 'placesInfo.murallasPamplona.name',
        description: 'Cinco kilómetros de murallas centenarias que rodean el casco antiguo, constituyendo uno de los complejos bélicos mejor conservados de España.',
        descKey: 'placesInfo.murallasPamplona.desc',
        image: '/assets/destinos/pamplona.jpg',
        category: 'Militar',
        storageUrl: 'assets/destinos/pamplona.jpg'
    },
    {
        id: 'san_miguel_aralar',
        name: 'Santuario de San Miguel de Aralar',
        nameKey: 'placesInfo.sanMiguelAralar.name',
        description: 'Templo milenario ubicado a más de 1.200 metros de altitud que alberga un retablo románico, obra cumbre de la esmaltería europea.',
        descKey: 'placesInfo.sanMiguelAralar.desc',
        image: '/assets/destinos/urbasa.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/urbasa.jpg'
    },
    {
        id: 'monasterio_fitero',
        name: 'Monasterio de Fitero',
        nameKey: 'placesInfo.monasterioFitero.name',
        description: 'El primer monasterio cisterciense de la Península Ibérica, cuya iglesia abacial es de las más importantes de la orden en Europa.',
        descKey: 'placesInfo.monasterioFitero.desc',
        image: '/assets/destinos/leyre.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/leyre.jpg'
    },
    {
        id: 'cueva_zugarramurdi',
        name: 'Cueva de Zugarramurdi',
        nameKey: 'placesInfo.zugarramurdi.name',
        description: 'Túnel kárstico donde la leyenda sitúa la celebración de akelarres, las fiestas rituales juzgadas por la Inquisición en el siglo XVII.',
        descKey: 'placesInfo.zugarramurdi.desc',
        image: '/assets/destinos/baztan.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/baztan.jpg'
    },
    {
        id: 'palacio_reyes_estella',
        name: 'Palacio de los Reyes de Navarra (Estella)',
        nameKey: 'placesInfo.palacioReyesEstella.name',
        description: 'El único edificio románico de carácter civil en Navarra, actual sede del Museo Gustavo de Maeztu.',
        descKey: 'placesInfo.palacioReyesEstella.desc',
        image: '/assets/destinos/estella.jpg',
        category: 'Civil',
        storageUrl: 'assets/destinos/estella.jpg'
    },
    {
        id: 'cascada_xorroxin',
        name: 'Cascada de Xorroxin',
        nameKey: 'placesInfo.cascadaXorroxin.name',
        description: 'Hermoso salto de agua en el valle de Baztán, rodeado de una vegetación espectacular de hayas y robles.',
        descKey: 'placesInfo.cascadaXorroxin.desc',
        image: '/assets/destinos/baztan.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/baztan.jpg'
    },
    {
        id: 'pico_orhi',
        name: 'Pico de Orhi',
        nameKey: 'placesInfo.picoOrhi.name',
        description: 'Con 2.017 metros, es el primer "dos mil" del Pirineo navarro y ofrece vistas excepcionales sobre la Selva de Irati.',
        descKey: 'placesInfo.picoOrhi.desc',
        image: '/assets/destinos/irati.jpg',
        category: 'Otros',
        storageUrl: 'assets/destinos/irati.jpg'
    },
    {
        id: 'monasterio_iranzu',
        name: 'Monasterio de Iranzu',
        nameKey: 'placesInfo.monasterioIranzu.name',
        description: 'Abadía cisterciense oculta en el valle de Yerri, construida entre los siglos XII y XIV, conocida por su elegante y austero claustro gótico.',
        descKey: 'placesInfo.monasterioIranzu.desc',
        image: '/assets/destinos/leyre.jpg',
        category: 'Religioso',
        storageUrl: 'assets/destinos/leyre.jpg'
    },
];
