// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyA6lz-_sC3XZnUmTAuQdJGCMQVM90mKX1M",
	authDomain: "test-cd4c7.firebaseapp.com",
	projectId: "test-cd4c7",
	storageBucket: "test-cd4c7.appspot.com",
	messagingSenderId: "558980308364",
	appId: "1:558980308364:web:8f3cfb260388203b704aa9",
	measurementId: "G-29B1GCRWHY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, firebase };
