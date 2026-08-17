import { db, firebaseConfig } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut, deleteUser } from 'firebase/auth';

// Initialize a secondary app instance just for creating new users.
// This prevents the Super Admin from being logged out when they create a sub-admin.
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

const userService = {
  async getAll() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data: users };
  },

  async getById(id) {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('User not found');
    return { data: { id: docSnap.id, ...docSnap.data() } };
  },

  async create(name, email, password) {
    // 1. Create the user in Firebase Authentication using the secondary app
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const newUid = userCredential.user.uid;
    
    // 2. Immediately sign out of the secondary app
    await signOut(secondaryAuth);

    // 3. Create the user's profile document in Firestore using their new UID
    const docRef = doc(db, 'users', newUid);
    await setDoc(docRef, {
      name,
      email,
      role: 'sub_admin',
      active: true,
    });
    
    return { data: { id: newUid, name, email, role: 'sub_admin', active: true } };
  },

  async update(id, name, email) {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, { name, email });
    return { data: { id, name, email } };
  },

  async toggleStatus(id) {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('User not found');
    
    const newStatus = !docSnap.data().active;
    await updateDoc(docRef, { active: newStatus });
    return { data: { id, ...docSnap.data(), active: newStatus } };
  },

  async delete(id) {
    // Note: This only deletes the Firestore document.
    // Deleting the Firebase Auth account requires the user to be signed in or using an Admin SDK.
    // We will just disable/delete their profile here so they can't access the app.
    await deleteDoc(doc(db, 'users', id));
    return { success: true };
  },
};

export default userService;
