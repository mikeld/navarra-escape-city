
import { Enigma } from '../types';

export const ENIGMAS: Enigma[] = [
    {
        id: 'cadenas_navarra',
        number: 1,
        title: 'Las Cadenas de la Victoria',
        description: '¿En qué famosa batalla Sancho VII el Fuerte rompió las cadenas que hoy forman nuestro escudo?',
        clues: [
            'Ocurrió en el año 1212.',
            'Fue una batalla decisiva de la Reconquista.',
            'El nombre empieza por N...'
        ],
        type: 'INPUT',
        correctAnswer: 'Navas de Tolosa'
    },
    {
        id: 'rey_sabio',
        number: 2,
        title: 'El Rey Carlos III el Noble',
        description: '¿Cuál era el lema de este rey, constructor del Palacio de Olite, que buscaba la paz?',
        clues: [
            'Es una palabra en francés antiguo.',
            'Significa algo así como "A pesar de todo".',
            'Comienza por U...'
        ],
        type: 'INPUT',
        correctAnswer: 'Uayn'
    }
];
