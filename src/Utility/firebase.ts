// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyD0upLJKjt8_6X6D5xMNA6ufk9fIPOJnUU",
	authDomain: "react-chat-app-00.firebaseapp.com",
	projectId: "react-chat-app-00",
	storageBucket: "react-chat-app-00.appspot.com",
	messagingSenderId: "573722864435",
	appId: "1:573722864435:web:4e25b9cdb0f4ddd56e2c46",
};

function init() {
	return null;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);
const realtimeDB = getDatabase();

export { firestoreDB, init, realtimeDB };
