import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "transactions";
const MOCK_STORAGE_KEY = "financeflow_mock_transactions";

const getMockTransactions = () => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveMockTransactions = (transactions) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(transactions));
  // Trigger a custom event for "mock-on-snapshot" behavior
  window.dispatchEvent(new Event('mock-transactions-updated'));
};

export const transactionService = {
  // Add a new transaction
  addTransaction: async (userId, data) => {
    if (userId === 'demo-user-123') {
      const transactions = getMockTransactions();
      const newTransaction = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        userId,
        createdAt: new Date().toISOString(),
        date: data.date || new Date().toISOString()
      };
      transactions.push(newTransaction);
      saveMockTransactions(transactions);
      return newTransaction.id;
    }

    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        userId,
        createdAt: serverTimestamp(),
        date: data.date || new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  // Update an existing transaction
  updateTransaction: async (id, data, userId) => {
    if (userId === 'demo-user-123') {
      const transactions = getMockTransactions();
      const index = transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...data, updatedAt: new Date().toISOString() };
        saveMockTransactions(transactions);
      }
      return;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

  // Delete a transaction
  deleteTransaction: async (id, userId) => {
    if (userId === 'demo-user-123') {
      const transactions = getMockTransactions();
      const filtered = transactions.filter(t => t.id !== id);
      saveMockTransactions(filtered);
      return;
    }

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },

  // Subscribe to user's transactions
  subscribeToTransactions: (userId, callback) => {
    if (userId === 'demo-user-123') {
      const handleUpdate = () => {
        const transactions = getMockTransactions();
        // Sort by date desc
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        callback(transactions);
      };

      window.addEventListener('mock-transactions-updated', handleUpdate);
      handleUpdate(); // Initial call

      return () => window.removeEventListener('mock-transactions-updated', handleUpdate);
    }

    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(transactions);
    }, (error) => {
      console.error("Error subscribing to transactions:", error);
    });
  },

  // Get monthly summary
  getMonthlySummary: async (userId, month, year) => {
    if (userId === 'demo-user-123') {
      const transactions = getMockTransactions();
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

      const filtered = transactions.filter(t => {
        const d = new Date(t.date);
        return d >= startOfMonth && d <= endOfMonth;
      });

      let income = 0;
      let expenses = 0;
      const categories = {};

      filtered.forEach((t) => {
        if (t.type === 'income') {
          income += Number(t.amount);
        } else {
          expenses += Number(t.amount);
          categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
        }
      });

      return { income, expenses, balance: income - expenses, categories };
    }

    const startOfMonth = new Date(year, month, 1).toISOString();
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      where("date", ">=", startOfMonth),
      where("date", "<=", endOfMonth)
    );

    const querySnapshot = await getDocs(q);
    let income = 0;
    let expenses = 0;
    const categories = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.type === 'income') {
        income += Number(data.amount);
      } else {
        expenses += Number(data.amount);
        categories[data.category] = (categories[data.category] || 0) + Number(data.amount);
      }
    });

    return { income, expenses, balance: income - expenses, categories };
  }
};
