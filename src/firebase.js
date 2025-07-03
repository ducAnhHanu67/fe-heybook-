import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, set, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDqQoO6o4t6BLXaMb31o1Z-vq0Tknj5yg0",
    authDomain: "heybook-2f3e1.firebaseapp.com",
    projectId: "heybook-2f3e1",
    storageBucket: "heybook-2f3e1.appspot.com",
    messagingSenderId: "30959635985",
    appId: "1:30959635985:web:f7acdc08001e43c438d6bb0",
    measurementId: "G-66SH77M7Z1",
    databaseURL: "https://heybook-2f3e1-default-rtdb.asia-southeast1.firebasedatabase.app"
}


const app = initializeApp(firebaseConfig)

const db = getDatabase(app)

export { db, ref, onValue, push, set }
