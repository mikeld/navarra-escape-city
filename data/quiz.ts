
import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "¿Qué rey de Navarra es conocido como 'el Noble' y convirtió Navarra en su residencia favorita?",
    options: ["Sancho el Fuerte", "Carlos III", "Juan de Albret", "Teobaldo I"],
    correctAnswer: 1, // Carlos III
    explanation: "Carlos III el Noble mandó construir el Palacio Real de Navarra, uno de los conjuntos góticos más bellos de Europa."
  },
  {
    id: 2,
    question: "¿Qué elemento del Palacio de Navarra se decía que 'cantaba' con el viento?",
    options: ["Las campanas de Santa María", "Las láminas de cobre de las torres", "Las gárgolas de piedra", "Los jardines colgantes"],
    correctAnswer: 1, // Las láminas de cobre
    explanation: "La leyenda cuenta que las láminas de cobre que cubrían los techos vibraban con el viento creando una melodía."
  }
];

export const TRIVIA_QUESTIONS = [
  { id: 1, question: "¿En qué siglo se construyó la mayor parte del Palacio Real de Navarra?", answer: "Siglo XV (Gótico)" },
  { id: 2, question: "Navarra fue sede de la corte de los Reyes de _____.", answer: "Navarra" }
];
