import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "userProfiles";
const MOCK_STORAGE_KEY = "financeflow_mock_profile";

export const userProfileService = {
  getUserProfile: async (userId) => {
    if (userId === 'demo-user-123') {
      const data = localStorage.getItem(MOCK_STORAGE_KEY);
      return data ? JSON.parse(data) : { budgetLimit: 2500 };
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Create default profile
        const defaultProfile = { budgetLimit: 2500 };
        await setDoc(docRef, defaultProfile);
        return defaultProfile;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return { budgetLimit: 2500 }; // Fallback
    }
  },

  updateBudgetLimit: async (userId, budgetLimit) => {
    if (userId === 'demo-user-123') {
      const profile = { budgetLimit };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(profile));
      return;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      await updateDoc(docRef, { budgetLimit });
    } catch (error) {
      console.error("Error updating budget limit:", error);
      throw error;
    }
  }
};
