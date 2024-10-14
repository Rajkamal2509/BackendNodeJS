
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

const firebase = require('firebase/app')
const {getAuth} = require('firebase/auth')
const firebaseConfig = {
    apiKey: "AIzaSyAtGDubnkyG-SfYVeGWCoZy82Izrc-rFRE",
    authDomain: "kalaingar-100.firebaseapp.com",
    projectId: "kalaingar-100",
    storageBucket: "kalaingar-100.appspot.com",
    messagingSenderId: "784818364009",
    appId: "1:784818364009:web:43c883ded6efa70f184cf8",
    measurementId: "G-P60NNTEXC0"
};

const app = firebase.initializeApp(firebaseConfig);

module.exports = getAuth(app);




