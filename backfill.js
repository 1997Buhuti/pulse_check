import { db } from './src/services/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

async function backfillCommentCounts() {
  console.log("Starting backfill...");
  const kudosSnapshot = await getDocs(collection(db, 'kudos'));
  
  for (const kudoDoc of kudosSnapshot.docs) {
    const commentsSnapshot = await getDocs(collection(db, 'kudos', kudoDoc.id, 'comments'));
    const count = commentsSnapshot.size;
    
    await updateDoc(doc(db, 'kudos', kudoDoc.id), {
      commentCount: count
    });
    console.log(`Updated kudo ${kudoDoc.id} with ${count} comments.`);
  }
  console.log("Backfill complete!");
}

backfillCommentCounts();
