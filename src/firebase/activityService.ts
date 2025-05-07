import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './config';
import { Activity } from '../types/habit';

const COLLECTION_NAME = 'habits';
const activitiesCollection = collection(db, COLLECTION_NAME);

// Add a new activity
export const addActivity = async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
  const docRef = await addDoc(activitiesCollection, {
    name: activity.name,
    date: activity.date,
    duration: activity.duration
  });

  return {
    id: docRef.id,
    ...activity
  };
};

// Get all activities
export const getActivities = async (): Promise<Activity[]> => {
  const q = query(activitiesCollection, orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    date: doc.data().date,
    duration: doc.data().duration
  }));
};

// Delete an activity
export const deleteActivity = async (id: string): Promise<void> => {
  const activityDoc = doc(db, COLLECTION_NAME, id);
  await deleteDoc(activityDoc);
};
