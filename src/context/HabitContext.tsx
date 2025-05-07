'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Activity } from '../types/habit';
import * as activityService from '../firebase/activityService';

interface ActivityContextType {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  addActivity: (name: string, date: string, duration: number) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load activities from Firestore on initial render
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const activitiesData = await activityService.getActivities();
        setActivities(activitiesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const addActivity = async (name: string, date: string, duration: number) => {
    try {
      setLoading(true);
      const newActivity = await activityService.addActivity({
        name,
        date,
        duration,
      });
      setActivities((prevActivities) => [...prevActivities, newActivity]);
      setError(null);
    } catch (err) {
      console.error('Error adding activity:', err);
      setError('Failed to add activity. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      setLoading(true);
      await activityService.deleteActivity(id);
      setActivities((prevActivities) =>
        prevActivities.filter(activity => activity.id !== id)
      );
      setError(null);
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Failed to delete activity. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActivityContext.Provider
      value={{ activities, loading, error, addActivity, deleteActivity }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within a HabitProvider');
  }
  return context;
}
