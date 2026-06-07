//CDN
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyCMTDJD78Jr9P8tYNeVpIh2NM_-qhP2s6Q",
authDomain: "weddingvincenzoangelica.firebaseapp.com",
projectId: "weddingvincenzoangelica",
storageBucket: "weddingvincenzoangelica.firebasestorage.app",
messagingSenderId: "93654078352",
appId: "1:93654078352:web:fec3cdd1736d6416499915",
measurementId: "G-3QR9MRR4KR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const dbInstance = getFirestore(app);
// Esportiamo come default per semplificare l'import
export default dbInstance;
