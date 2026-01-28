
export enum StageType {
  INTRO = 'INTRO',
  PUZZLE = 'PUZZLE',
  OUTRO = 'OUTRO'
}

export enum Phase {
  // Elgacena phases
  FORTRESS = 'FORTRESS', // 🏰 La Fortaleza
  WATER = 'WATER',       // 🌊 El Río
  KNOWLEDGE = 'KNOWLEDGE', // 👁️ El Conocimiento
  // EGA98 phases
  EGA_PROLOGUE = 'EGA_PROLOGUE', // 📺 El Prólogo
  EGA_ACT_0 = 'EGA_ACT_0', // 📧 El Presente (Email/Testament)
  EGA_ACT_1 = 'EGA_ACT_1', // 🚌 La Distracción
  EGA_ACT_2 = 'EGA_ACT_2', // 💰 El Robo
  EGA_ACT_3 = 'EGA_ACT_3', // 🕹️ El Cosmos
  EGA_ACT_4 = 'EGA_ACT_4', // 🏃 La Huida
  EGA_ACT_5 = 'EGA_ACT_5', // 🎭 La Coartada
  EGA_ACT_6 = 'EGA_ACT_6', // 💔 La Ruptura
  EGA_ACT_7 = 'EGA_ACT_7', // 🔓 El Acceso
  // Navarra phases
  OLITE_PALACE = 'OLITE_PALACE' // 🏰 El Palacio Real
}

export interface TravelConfig {
  videoUrl?: string; // Si hay video de transición
  instructionText: string; // "Ve a la plaza..."
  locationName: string;
  googleMapsUrl?: string; // Enlace opcional a Google Maps
  coordinates?: { // Coordenadas para Geofencing
    lat: number;
    lng: number;
  };
}

export interface Character {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  storageUrl?: string;
  resolvedImageUrl?: string;
  isFictional?: boolean;
  category?: 'Juego' | 'Realeza' | 'Militar' | 'Religión' | 'Cultura' | 'Sociedad' | 'Política';
}

export interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  storageUrl?: string;
  resolvedImageUrl?: string;
  category?: 'Civil' | 'Religioso' | 'Militar' | 'Ingeniería' | 'Otros';
}

// --- TIPOS NUEVOS PARA HISTORIA ---
export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export interface WomanFigure {
  name: string;
  bio: string;
  bioKey?: string;
}

export interface WomanCategory {
  category: string;
  catKey?: string;
  figures: WomanFigure[];
}

export interface CastleInfo {
  name: string;
  description: string;
}

export interface CastleHistory {
  stage: string;
  title: string;
  description: string;
  details: CastleInfo[];
}
// ----------------------------------

export interface CryptexOption {
  id: string;
  label: string;
}

export interface CryptexRoller {
  id: string;
  label: string;
  question: string;
  options: CryptexOption[];
}

export interface PuzzleData {
  id: string;
  phase: Phase; // Nueva propiedad para el indicador de fase
  title: string;
  location: string;
  description: string;
  clue: string;
  image?: string;
  storageImage?: string; // Ruta en Firebase Storage
  hint?: string;
  correctAnswer: string | number | string[];
  successMessage: string;
  nextLocationHint: string;
  type: 'INPUT_NUMBER' | 'INPUT_TEXT' | 'COIN_BALANCE' | 'SELECT_MULTI' | 'CONSTELLATION' | 'ORDER_IMAGES' | 'FINAL_REVEAL' | 'CRYPTEX' | 'STAIRS_LOCK' | 'MERCHANT_LOCK' | 'SYNAGOGUE_PUZZLE' | 'SEPULCHRE_PUZZLE' | 'BRIDGE_PUZZLE' | 'BALANCE_PUZZLE' | 'INSCRIPTION_PUZZLE' | 'VIDEO_INTRO' | 'EMAIL_INBOX' | 'OLD_COMPUTER' | 'LOCATION_VIDEO' | 'TEXT_REVEAL' | 'ACCESS_PUZZLE' | 'VIDEO_FINALE';
  audioTranscript?: string;
  speaker?: string;
  fragmentId?: number;
  cryptexConfig?: CryptexRoller[];
  travelConfig?: TravelConfig; // Configuración para la pantalla de "ir al sitio"
  learnMoreId?: string; // ID para cargar información histórica extendida tras completar
}

export interface Fragment {
  id: number;
  title: string;
  content: string;
  author: string;
}

export interface GameState {
  currentStageIndex: number;
  isGameStarted: boolean;
  isGameFinished: boolean;
  inventory: number[];
  showDialogue: boolean;
  startTime?: number; // Para calcular tiempo total
  hintsUsed: number; // Contador de pistas
  mistakesMade: number; // Nuevo: Contador de fallos
}

// --- NUEVO: Game Configuration Interface ---
export interface GameConfig {
  id: string;
  title: string;
  description: string;
  puzzles: PuzzleData[];
  introSequence: boolean; // Si tiene secuencia de intro compleja
  outroVideo?: string; // Video final
  mapImage?: string; // Mapa general
}

export interface GameFeedback {
  rating: number;
  userName: string;
  likedMost: string;
  likedLeast: string;
  platform: string;
  date: string;
}

// --- ENIGMAS TYPES ---
export interface EnigmaCell {
  value: string;
  isEditable: boolean;
}

export interface EnigmaRow {
  cells: EnigmaCell[];
}

export interface EnigmaTable {
  headers: string[]; // ["Rey", "Barrio", "Año", "Hito", "Monumento"]
  rows: EnigmaRow[]; // Filas con datos y campos editables
  solution: string[][]; // Solución correcta para validación
  columnOptions?: string[][]; // Opciones disponibles para cada columna (opcional, para dropdowns)
}

export interface Difference {
  id: number;
  x: number; // Porcentaje X (0-100)
  y: number; // Porcentaje Y (0-100)
  radius: number; // Radio de tolerancia en porcentaje
}

export interface Enigma {
  id: string;
  number: number; // Enigma 1, 2, 3...
  title: string;
  description: string; // El desafío
  clues: string[]; // Array de 12 pistas
  image?: string; // Imagen opcional del enigma
  youtubeVideoId?: string; // ID del video de YouTube para la solución
  type?: 'TABLE' | 'DIFFERENCES' | 'INPUT'; // Tipo de enigma (por defecto TABLE)
  table?: EnigmaTable; // Configuración de la tabla interactiva (Opcional si es DIFFERENCES)
  differences?: Difference[]; // Configuración para encontrar diferencias (Opcional si es TABLE)
  solutionImage?: string; // Imagen de solución para DIFFERENCES
  solutionText?: string; // Texto explicativo de la solución
  publishDate?: string; // Fecha de publicación
  correctAnswer?: string | string[]; // Respuesta correcta para validación (especialmente para INPUT)
}

// --- USER AUTHENTICATION & PROFILE TYPES ---

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserGameProgress {
  gameId: string; // 'elgacena' | 'ega98'
  currentStageIndex: number;
  isCompleted: boolean;
  bestScore?: number;
  lastPlayed: string;
  hintsUsed: number;
  mistakesMade: number;
  completedAt?: string; // Date when completed (if isCompleted)
}

export interface UserEnigmaProgress {
  enigmaId: string;
  completedAt: string;
  attempts?: number;
}

export interface AuthContextType {
  user: any | null; // Firebase User type
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

