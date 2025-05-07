import React from 'react';
import Link from 'next/link';
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-3xl font-bold">Activity Tracker</h1>
            <Link
              href="/statistics"
              className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-3 rounded-md transition-colors text-sm md:text-base flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Stats
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 flex-grow">
        <ActivityForm />
        <ActivityList />
      </main>

      <footer className="border-t border-slate-700 mt-auto py-4 bg-slate-800 text-slate-400">
        <div className="container mx-auto px-4 text-center text-xs md:text-sm">
          <p>Prada Activity Tracker</p>
        </div>
      </footer>
    </div>
  );
}
