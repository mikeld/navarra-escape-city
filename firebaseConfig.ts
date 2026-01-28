
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// ------------------------------------------------------------------
// CONFIGURACIÓN MANUAL DE FIREBASE (OLITE)
// Copia y pega aquí tus claves directamente desde la consola de Firebase.
// ------------------------------------------------------------------

const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "navarraescape.firebaseapp.com",
    projectId: "navarraescape",
    storageBucket: "navarraescape.firebasestorage.app",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { db, storage, analytics, auth };
