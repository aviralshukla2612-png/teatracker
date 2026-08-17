import { db } from './firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import rateService from './rateService';

const entryService = {
  async getAll(month = null, year = null) {
    const entriesRef = collection(db, 'entries');
    // Simplified query, fetching all and filtering client-side for ease
    const q = query(entriesRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    let entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (month && year) {
      entries = entries.filter(entry => {
        const d = new Date(entry.date);
        return d.getMonth() + 1 === parseInt(month) && d.getFullYear() === parseInt(year);
      });
    }

    return { data: entries };
  },

  async getById(id) {
    const docRef = doc(db, 'entries', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Entry not found');
    return { data: { id: docSnap.id, ...docSnap.data() } };
  },

  async create(date, teaQuantity, coffeeQuantity) {
    const { data: rates } = await rateService.get();
    
    const teaQ = parseInt(teaQuantity) || 0;
    const coffeeQ = parseInt(coffeeQuantity) || 0;
    const teaRate = rates.teaRate;
    const coffeeRate = rates.coffeeRate;
    const total_expense = (teaQ * teaRate) + (coffeeQ * coffeeRate);

    const docRef = await addDoc(collection(db, 'entries'), {
      date,
      tea_quantity: teaQ,
      coffee_quantity: coffeeQ,
      tea_rate: teaRate,
      coffee_rate: coffeeRate,
      total_expense
    });

    return { data: { id: docRef.id } };
  },

  async update(id, teaQuantity, coffeeQuantity, date = null) {
    const docRef = doc(db, 'entries', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Entry not found');

    const entry = docSnap.data();
    const teaQ = parseInt(teaQuantity) || 0;
    const coffeeQ = parseInt(coffeeQuantity) || 0;
    
    const updates = {
      tea_quantity: teaQ,
      coffee_quantity: coffeeQ,
      total_expense: (teaQ * entry.tea_rate) + (coffeeQ * entry.coffee_rate)
    };
    if (date) updates.date = date;

    await updateDoc(docRef, updates);
    return { success: true };
  },

  async delete(id) {
    await deleteDoc(doc(db, 'entries', id));
    return { success: true };
  },
};

export default entryService;
