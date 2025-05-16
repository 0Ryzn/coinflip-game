import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, query, orderBy, limit,
  getDocs, doc, getDoc, setDoc, updateDoc
} from "firebase/firestore";
import { firebaseConfig } from "./firebase-config.js";

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let username = '';
let saldo = 100;

function startGame() {
  const input = document.getElementById('username');
  if (!input.value.trim()) {
    alert('Masukkan nama kamu sayang!');
    return;
  }
  username = input.value.trim();
  document.getElementById('userArea').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';
  document.getElementById('playerName').innerText = username;
  updateSaldo();
  loadLeaderboard();
}

function updateSaldo() {
  document.getElementById('saldo').innerText = saldo;
}

async function flipCoin() {
  const pilihan = document.getElementById('pilihan').value;
  const taruhan = Number(document.getElementById('taruhan').value);

  if (!taruhan || taruhan <= 0 || taruhan > saldo) {
    alert('Masukkan jumlah taruhan yang valid ya sayang!');
    return;
  }

  const hasilFlip = Math.random() < 0.5 ? 'Head' : 'Tail';
  let hasilText = `Koin menunjukkan ${hasilFlip}. `;

  if (pilihan === hasilFlip) {
    saldo += taruhan;
    hasilText += 'Kamu menang! 🎉';
    await updateWinner(username);
  } else {
    saldo -= taruhan;
    hasilText += 'Kamu kalah 😢';
  }

  updateSaldo();
  document.getElementById('hasil').innerText = hasilText;

  // Simpan history lokal (bisa juga simpan di Firebase kalau mau)
  saveHistory(hasilText);

  loadLeaderboard();
}

function saveHistory(hasil) {
  let history = JSON.parse(localStorage.getItem(username + '_history') || '[]');
  history.push(hasil);
  localStorage.setItem(username + '_history', JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const historyData = JSON.parse(localStorage.getItem(username + '_history') || '[]');
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  historyData.forEach(h => {
    const item = document.createElement('li');
    item.innerText = h;
    list.appendChild(item);
  });
}

async function loadLeaderboard() {
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = '';

  const q = query(collection(db, "leaderboard"), orderBy("wins", "desc"), limit(10));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const li = document.createElement('li');
    li.textContent = `${doc.data().username} - ${doc.data().wins} kemenangan`;
    leaderboardList.appendChild(li);
  });
}

async function updateWinner(username) {
  const userRef = doc(db, "leaderboard", username);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    await updateDoc(userRef, {
      wins: userSnap.data().wins + 1
    });
  } else {
    await setDoc(userRef, {
      username: username,
      wins: 1
    });
  }
}
