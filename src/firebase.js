import firebase from "firebase";

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyB3DxRYlwVUwbTC7pcYa9hNsutWaMT80ds",
    authDomain: "instagram-clone-react-1f668.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-1f668.firebaseio.com",
    projectId: "instagram-clone-react-1f668",
    storageBucket: "instagram-clone-react-1f668.appspot.com",
    messagingSenderId: "450771304517",
    appId: "1:450771304517:web:f6b76ba48491b48613232c",
    measurementId: "G-YPS6QG8D9E"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };