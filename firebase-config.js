// Import Firebase SDK dari CDN (pastikan kamu pakai module di script.js dan index.html)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqhtQTHz5ce7ULWM1r4UvqVd-DvGyzHfM",
  authDomain: "coinflip-game-dc89b.firebaseapp.com",
  projectId: "coinflip-game-dc89b",
  storageBucket: "coinflip-game-dc89b.appspot.com",
  messagingSenderId: "641730135558",
  appId: "1:641730135558:web:1a886439033df4b5962587",
  measurementId: "G-MWKG8TQC9B"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
