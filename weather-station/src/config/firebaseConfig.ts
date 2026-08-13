// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {appId, authDomain, firebaseApiKey, messagingSenderId, projectId, storageBucket} from "../utils";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);