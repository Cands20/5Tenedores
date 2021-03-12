import firebase from "firebase/app";


const firebaseConfig={
    apiKey: "AIzaSyDhywdxLo-8e_xbxf7MS2kYpaWFhx5tK0M",
    authDomain: "tenedores-f195b.firebaseapp.com",
    projectId: "tenedores-f195b",
    storageBucket: "tenedores-f195b.appspot.com",
    messagingSenderId: "456670039718",
    appId: "1:456670039718:web:d1aee551603e229a4c6e67"

};

export const firebaseApp = firebase.initializeApp(firebaseConfig);