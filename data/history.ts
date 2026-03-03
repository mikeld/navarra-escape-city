import { Fragment } from '../types';

export const FRAGMENTS: Fragment[] = [
    {
        id: 1,
        title: 'El Palacio Real',
        content: 'El Palacio de Navarra fue la sede real más lujosa de su época, un capricho de piedra y cristal.',
        author: 'Cronista de la Corte'
    }
];

export const TIMELINE_EVENTS = [];
export const FLASHCARD_DATA = [];
export const WOMEN_HISTORY = [];
export const CASTLES_DATA = [];

export const GLOSSARY_TERMS = [
    { term: 'Reyno', defKey: 'glossary.reyno' },
    { term: 'Fueros', defKey: 'glossary.fueros' },
    { term: 'Merindad', defKey: 'glossary.merindad' },
    { term: 'Burgo', defKey: 'glossary.burgo' },
    { term: 'Crismón', defKey: 'glossary.crismon' },
    { term: 'Cadenas de Navarra', defKey: 'glossary.cadenas' },
    { term: 'Camino de Santiago', defKey: 'glossary.camino' },
    { term: 'Peregrino', defKey: 'glossary.peregrino' },
    { term: 'Agramonteses y Beaumonteses', defKey: 'glossary.facciones' },
    { term: 'Jus del Castillo', defKey: 'glossary.jus_castillo' },
    { term: 'Sinagoga de Elgacena', defKey: 'glossary.sinagoga' },
    { term: 'Romanico', defKey: 'glossary.romanico' },
    { term: 'Infanzón', defKey: 'glossary.infanzon' },
    { term: 'Almirante del Reyno', defKey: 'glossary.almirante' },
    { term: 'Javierada', defKey: 'glossary.javierada' },
    { term: 'Navas de Tolosa', defKey: 'glossary.navas' },
];

export const NAVARRA_QUIZ_QUESTIONS = [
    {
        id: 1,
        question: '¿En qué año tuvo lugar la Batalla de las Navas de Tolosa?',
        options: ['1212', '1134', '1324', '1035'],
        correctAnswer: 0,
        explanation: 'La Batalla de las Navas de Tolosa se libró en 1212. La victoria de los reinos cristianos contra el califato almohade fue decisiva para la Reconquista y Sancho VII el Fuerte rompió las cadenas del campamento del califa, hecho que quedó plasmado en el escudo de Navarra.'
    },
    {
        id: 2,
        question: '¿Quién fundó el Palacio Real de Olite?',
        options: ['Juana I', 'Sancho III el Mayor', 'Carlos III el Noble', 'Teobaldo I'],
        correctAnswer: 2,
        explanation: 'Carlos III el Noble (1387-1425) transformó y engrandeció el Palacio Real de Olite hasta convertirlo en una de las residencias más fastuosas de Europa, con jardines exóticos, zoológico y torres majestuosas.'
    },
    {
        id: 3,
        question: '¿De qué ciudad navarra era originario San Francisco Javier?',
        options: ['Estella', 'Pamplona', 'Sangüesa', 'Javier'],
        correctAnswer: 3,
        explanation: 'San Francisco Javier (1506-1552) nació en el Castillo de Javier, en la Merindad de Sangüesa. Es Patrón de Navarra y uno de los misioneros más importantes de la historia.'
    },
    {
        id: 4,
        question: '¿Cuál es la segunda ciudad actualmente disponible en Navarra Escape City?',
        options: ['Tafalla', 'Olite', 'Sangüesa', 'Solo Estella disponible'],
        correctAnswer: 3,
        explanation: 'Por ahora, solo Estella-Lizarra tiene su Escape City disponible. Olite y Tafalla están en desarrollo y estarán disponibles próximamente.'
    },
    {
        id: 5,
        question: '¿Qué simbolizan las cadenas del escudo de Navarra?',
        options: ['La opresión romana', 'La victoria en las Navas de Tolosa', 'La alianza con Castilla', 'El dominio sobre los vascos'],
        correctAnswer: 1,
        explanation: 'Las cadenas del escudo de Navarra representan las cadenas del campamento del califa almohade Muhammad al-Nasir, que Sancho VII el Fuerte rompió en la Batalla de las Navas de Tolosa (1212).'
    }
];
