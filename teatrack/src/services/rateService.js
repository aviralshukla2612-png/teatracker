import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const rateService = {
  async get() {
    const docRef = doc(db, 'settings', 'rates');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { data: docSnap.data() };
    } else {
      // Default rates
      return { data: { teaRate: 10, coffeeRate: 15 } };
    }
  },

  async update(teaRate, coffeeRate) {
    const docRef = doc(db, 'settings', 'rates');
    await setDoc(docRef, {
      teaRate: parseFloat(teaRate),
      coffeeRate: parseFloat(coffeeRate)
    });
    return { data: { teaRate, coffeeRate } };
  },
};

export default rateService;
