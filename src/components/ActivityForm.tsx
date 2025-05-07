'use client';

import React, { useState } from 'react';
import { useActivities } from '../context/HabitContext';
import { format } from 'date-fns';

export default function ActivityForm() {
  const { addActivity, error } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [duration, setDuration] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedActivity && duration > 0) {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await addActivity(selectedActivity, new Date(date).toISOString(), duration);
        setSelectedActivity(null);
        setDuration(15);
      } catch (err) {
        setSubmitError('Failed to save activity. Please try again.');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6 text-white">

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {submitError && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-3 rounded-md mb-4">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3">
            Select Activity Type *
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Cold Plunge button */}
            <button
              type="button"
              onClick={() => setSelectedActivity('Cold Plunge')}
              className={`flex-1 py-4 px-5 rounded-md border-2 transition-all transform hover:scale-105 ${
                selectedActivity === 'Cold Plunge'
                  ? 'bg-blue-600 border-blue-300 text-white shadow-md shadow-blue-500/50'
                  : 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600'
              }`}
              disabled={isSubmitting}
            >
              <div className="flex items-center justify-center">
                <span className="text-lg mr-2">❄️</span>
                <span className="font-bold">Cold Plunge</span>
              </div>
            </button>

            {/* Meditation button */}
            <button
              type="button"
              onClick={() => setSelectedActivity('Meditation')}
              className={`flex-1 py-4 px-5 rounded-md border-2 transition-all transform hover:scale-105 ${
                selectedActivity === 'Meditation'
                  ? 'bg-purple-600 border-purple-300 text-white shadow-md shadow-purple-500/50'
                  : 'bg-purple-500 border-purple-400 text-white hover:bg-purple-600'
              }`}
              disabled={isSubmitting}
            >
              <div className="flex items-center justify-center">
                <span className="text-lg mr-2">🧘</span>
                <span className="font-bold">Meditation</span>
              </div>
            </button>
          </div>
          {!selectedActivity && !isSubmitting && (
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedActivity || isSubmitting}
          className={`w-full py-3 px-4 rounded-md transition duration-300 text-lg mt-4 ${
            selectedActivity && !isSubmitting
              ? 'bg-green-600 hover:bg-green-700 text-white font-bold shadow-md shadow-green-500/40'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            'Add Activity'
          )}
        </button>
      </form>
    </div>
  );
}
