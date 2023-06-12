const firebaseConfig = {
    apiKey: "AIzaSyC_gduYEPHaqVoVIO9J_u6NvtMBJiWBlM4",
    authDomain: "punto-de-venta-vof.firebaseapp.com",
    projectId: "punto-de-venta-vof",
    storageBucket: "punto-de-venta-vof.appspot.com",
    messagingSenderId: "603331007040",
    appId: "1:603331007040:web:283dd125d59a3b16f685a5",
    measurementId: "G-STWGSV82TW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();
