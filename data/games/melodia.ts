
import { GameConfig, Phase } from '../../types';

export const GAME_MELODIA: GameConfig = {
    id: 'melodia',
    title: 'Portal de Escape City en Navarra',
    description: 'Descubre los secretos del Palacio Real de Navarra.',
    introSequence: true,
    puzzles: [
        {
            id: 'START',
            phase: Phase.OLITE_PALACE,
            title: 'El Despertar de la Torre',
            location: 'Torre del Homenaje',
            description: 'Las láminas de cobre vibran con una frecuencia extraña.',
            clue: 'Cuenta cuántas láminas brillan bajo el sol del mediodía.',
            correctAnswer: '7',
            successMessage: 'Has identificado la primera nota de la Melodía Perdida.',
            nextLocationHint: 'Ve hacia la fachada de Santa María la Real.',
            type: 'INPUT_NUMBER'
        }
    ]
};
