
import { Enigma } from '../types';

export const ENIGMAS: Enigma[] = [
    {
        id: '1',
        number: 1,
        title: 'La Melodía del Viento',
        description: 'Observa las torres del Palacio. ¿Qué secreto esconden las láminas de cobre?',
        clues: Array(12).fill('Pista pendiente de definición histórica.'),
        type: 'TABLE',
        table: {
            headers: ['Torre', 'Láminas', 'Nota'],
            rows: [
                { cells: [{ value: 'Homenaje', isEditable: false }, { value: '', isEditable: true }, { value: '', isEditable: true }] }
            ],
            solution: [['Homenaje', '7', 'Do']]
        }
    }
];
