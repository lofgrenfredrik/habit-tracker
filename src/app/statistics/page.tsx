'use client';

import React from 'react';
import Link from 'next/link';
import ActivityStatistics from '../../components/ActivityStatistics';
import { useActivities } from '../../context/HabitContext';

export default function StatisticsPage() {
  const { activities, loading, error } = useActivities();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-4 md:py-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-3xl font-bold">Activity Stats</h1>
            <Link
              href="/"
              className="bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-white py-2 px-3 md:px-4 rounded-md transition-colors text-sm md:text-base flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
          <p className="mt-1 text-blue-100 text-xs md:text-sm">View insights about your activities</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-4xl flex-grow">
        {error ? (
          <div className="bg-red-500 bg-opacity-20 p-4 md:p-6 rounded-lg border border-red-500 text-center">
            <p className="text-red-100">Error: {error}</p>
            <p className="text-red-200 mt-2">Try refreshing the page</p>
          </div>
        ) : loading && activities.length === 0 ? (
          <div className="bg-slate-700 p-6 md:p-8 rounded-lg shadow-lg flex items-center justify-center">
            <div className="flex flex-col items-center">
              <svg className="animate-spin mb-3 h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-slate-300">Loading your statistics...</p>
            </div>
          </div>
        ) : (
          <ActivityStatistics activities={activities} />
        )}
      </main>

      <footer className="border-t border-slate-700 py-4 bg-slate-800 text-slate-400 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs md:text-sm">
          <p>Activity Statistics - Analyze your tracking data</p>
        </div>
      </footer>
    </div>
  );
}
