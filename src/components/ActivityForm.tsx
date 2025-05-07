'use client';

import React, { useState } from 'react';
import { useActivities } from '../context/HabitContext';
import { format } from 'date-fns';

export default function ActivityForm() {
  const { addActivity } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [duration, setDuration] = useState(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedActivity && duration > 0) {
      addActivity(selectedActivity, new Date(date).toISOString(), duration);
      setSelectedActivity(null);
      setDuration(15);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 text-white">
      <h2 className="text-xl font-semibold mb-4">Track Activity</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3">
            Select Activity Type *
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setSelectedActivity('Cold Plunge')}
              className={`flex-1 py-4 px-5 rounded-md border-2 transition-all transform hover:scale-105 ${
                selectedActivity === 'Cold Plunge'
                  ? 'bg-blue-600 border-blue-300 text-white shadow-md shadow-blue-500/50'
                  : 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600'
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="text-lg mr-2">❄️</span>
                <span className="font-bold">Cold Plunge</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedActivity('Meditation')}
              className={`flex-1 py-4 px-5 rounded-md border-2 transition-all transform hover:scale-105 ${
                selectedActivity === 'Meditation'
                  ? 'bg-purple-600 border-purple-300 text-white shadow-md shadow-purple-500/50'
                  : 'bg-purple-500 border-purple-400 text-white hover:bg-purple-600'
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="text-lg mr-2">🧘</span>
                <span className="font-bold">Meditation</span>
              </div>
            </button>
          </div>
          {!selectedActivity && (
            <p className="text-xs text-red-300 mt-1">Please select an activity type</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-700 p-3 rounded-md">
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              required
            />
          </div>

          <div className="bg-slate-700 p-3 rounded-md">
            <label htmlFor="duration" className="block text-sm font-medium mb-1">
              Duration (minutes) *
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              min="1"
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedActivity}
          className={`w-full py-3 px-4 rounded-md transition duration-300 text-lg mt-4 ${
            selectedActivity
              ? 'bg-green-600 hover:bg-green-700 text-white font-bold shadow-md shadow-green-500/40'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Add Activity
        </button>
      </form>
    </div>
  );
}
