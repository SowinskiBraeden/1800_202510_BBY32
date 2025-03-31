const firebaseConfig = {
  apiKey: "AIzaSyCtHUCySgBdtR-vr2FUmKghKt8JLKPAHcc",
  authDomain: "demo06-c2bd1.firebaseapp.com",
  projectId: "demo06-c2bd1",
  storageBucket: "demo06-c2bd1.firebasestorage.app",
  messagingSenderId: "142451606971",
  appId: "1:142451606971:web:b0cf33be9112142e11f09e",
  measurementId: "G-8RCK349833" 
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
