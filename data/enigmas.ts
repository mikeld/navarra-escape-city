
import { Enigma } from '../types';

export const ENIGMAS: Enigma[] = [
    {
        id: 'cadenas_navarra',
        number: 1,
        title: 'enigmas.enigma1.title',
        description: 'enigmas.enigma1.description',
        clues: [
            'enigmas.enigma1.clue1',
            'enigmas.enigma1.clue2',
            'enigmas.enigma1.clue3'
        ],
        type: 'INPUT',
        correctAnswer: 'Navas de Tolosa'
    },
    {
        id: 'rey_sabio',
        number: 2,
        title: 'enigmas.enigma2.title',
        description: 'enigmas.enigma2.description',
        clues: [
            'enigmas.enigma2.clue1',
            'enigmas.enigma2.clue2',
            'enigmas.enigma2.clue3'
        ],
        type: 'INPUT',
        correctAnswer: 'Uayn'
    }
];
