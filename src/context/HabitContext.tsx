'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Activity } from '../types/habit';
import { v4 as uuidv4 } from 'uuid';

interface ActivityContextType {
  activities: Activity[];
  addActivity: (name: string, date: string, duration: number) => void;
  deleteActivity: (id: string) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load activities from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedActivities = localStorage.getItem('activities');
      if (savedActivities) {
        try {
          setActivities(JSON.parse(savedActivities));
        } catch (error) {
          console.error('Error parsing saved activities:', error);
        }
      }
    }
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activities', JSON.stringify(activities));
    }
  }, [activities]);

  const addActivity = (name: string, date: string, duration: number) => {
    const newActivity: Activity = {
      id: uuidv4(),
      name,
      date,
      duration,
    };
    setActivities([...activities, newActivity]);
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <ActivityContext.Provider
      value={{ activities, addActivity, deleteActivity }}
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
