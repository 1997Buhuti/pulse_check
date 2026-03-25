import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  increment,
  runTransaction
} from 'firebase/firestore';

export const useKudos = () => {
  const [kudos, setKudos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'kudos'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likes: doc.data().likes || [],
        timestamp: doc.data().timestamp?.toDate().getTime() || Date.now(),
      }));
      setKudos(docs);
    });
    return unsubscribe;
  }, []);

  const addKudo = async (kudo) => {
    try {
      await addDoc(collection(db, 'kudos'), {
        ...kudo,
        likes: [],
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Firestore Error:", error);
    }
  };

  const deleteKudo = async (id) => {
    try {
      await deleteDoc(doc(db, 'kudos', id));
    } catch (error) {
      console.error("Firestore Delete Error:", error);
    }
  };

  const toggleLike = async (id, userId, record) => {
    if (!userId) return;
    const kudoRef = doc(db, 'kudos', id);
    const isLiked = (record.likes || []).includes(userId);
    
    try {
      await updateDoc(kudoRef, {
        likes: isLiked ? arrayRemove(userId) : arrayUnion(userId)
      });
    } catch (error) {
      console.error("Toggle Like Error:", error);
    }
  };

  // Simplified comments for hackathon: store in sub-collection
  const addComment = async (kudoId, comment) => {
    try {
      await addDoc(collection(db, 'kudos', kudoId, 'comments'), {
        ...comment,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Add Comment Error:", error);
    }
  };

  return { kudos, addKudo, deleteKudo, toggleLike, addComment };
};

export const useComments = (kudoId) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!kudoId) return;
    const q = query(collection(db, 'kudos', kudoId, 'comments'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().getTime() || Date.now(),
      })));
    });
    return unsubscribe;
  }, [kudoId]);

  return comments;
};
