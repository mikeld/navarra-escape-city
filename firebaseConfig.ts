
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// ------------------------------------------------------------------
// CONFIGURACIÓN MANUAL DE FIREBASE (NAVARA HUB)
// ------------------------------------------------------------------

const firebaseConfig = {
    apiKey: "AIzaSyB4g7jhWh65CFdm9ZSpGaz-VapEt2UOEtE",
    authDomain: "navarraescapecity-4f7cb.firebaseapp.com",
    projectId: "navarraescapecity-4f7cb",
    storageBucket: "navarraescapecity-4f7cb.firebasestorage.app",
    messagingSenderId: "994680240985",
    appId: "1:994680240985:web:a84abbff7b5a229345ea48",
    measurementId: "G-L1MD3MS3ME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { db, storage, analytics, auth };
