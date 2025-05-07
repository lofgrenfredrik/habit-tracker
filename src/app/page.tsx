import React from 'react';
import Link from 'next/link';
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Activity Tracker</h1>
            <Link
              href="/statistics"
              className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              View Statistics
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ActivityForm />
        <ActivityList />
      </main>

      <footer className="border-t border-slate-700 mt-12 py-6 bg-slate-800 text-slate-400">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Prada Activity Tracker</p>
        </div>
      </footer>
    </div>
  );
}
