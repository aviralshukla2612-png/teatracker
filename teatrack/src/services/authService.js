import { auth, db } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const authService = {
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch role from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : { role: 'super_admin' }; // default to super_admin for the first user
    
    if (userData.active === false) {
      await signOut(auth);
      throw new Error('Account disabled');
    }

    const userInfo = {
      id: user.uid,
      email: user.email,
      role: userData.role,
      name: userData.name || 'Admin'
    };
    
    localStorage.setItem('teatrack_user', JSON.stringify(userInfo));
    return { success: true, user: userInfo };
  },

  async logout() {
    await signOut(auth);
    localStorage.removeItem('teatrack_user');
  },

  async me() {
    return this.getStoredUser();
  },

  getStoredUser() {
    const user = localStorage.getItem('teatrack_user');
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn() {
    return !!localStorage.getItem('teatrack_user');
  },

  isSuperAdmin() {
    const user = this.getStoredUser();
    return user?.role === 'super_admin';
  },
};

export default authService;
