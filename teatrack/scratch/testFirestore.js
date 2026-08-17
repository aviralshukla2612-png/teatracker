import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBJj7SkhWAHPG8NMsJiZOOA1voboPyNi8",
  authDomain: "tea-track-e5e42.firebaseapp.com",
  projectId: "tea-track-e5e42",
  storageBucket: "tea-track-e5e42.firebasestorage.app",
  messagingSenderId: "251448026324",
  appId: "1:251448026324:web:cf43d9dc534fef8f4c4741"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    console.log("Adding doc...");
    await setDoc(doc(db, "users", "test-uid-123"), {
      name: "Test Name",
      email: "test@test.com",
      role: "sub_admin",
      active: true
    });
    console.log("Doc added!");
    
    console.log("Fetching docs...");
    const snap = await getDocs(collection(db, "users"));
    snap.forEach(d => console.log(d.id, d.data()));
  } catch(e) {
    console.error("ERROR:", e);
  }
}

test();
