
import { PuzzleData, Phase } from '../types';

export const PUZZLES: PuzzleData[] = [
  {
    id: '1',
    phase: Phase.OLITE_PALACE,
    title: 'La Melodía del Viento',
    location: 'Torre del Homenaje',
    description: 'Sincroniza las láminas de cobre para recuperar la armonía perdida.',
    clue: 'Busca el patrón de vibración en las láminas de la torre más alta.',
    correctAnswer: '7',
    successMessage: '¡Excelente! La primera parte de la partitura ha sido recuperada.',
    nextLocationHint: 'Ve hacia la fachada de Santa María la Real.',
    type: 'INPUT_NUMBER'
  }
];
