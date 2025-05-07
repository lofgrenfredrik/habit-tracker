import React from 'react';
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Activity Tracker</h1>
          <p className="mt-2 text-blue-100">Track your cold plunges and meditation sessions</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ActivityForm />
        <ActivityList />
      </main>

      <footer className="border-t border-slate-700 mt-12 py-6 bg-slate-800 text-slate-400">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Activity Tracker - Simple tracking of your activities</p>
          <p className="mt-2">Data is saved in your browser&apos;s localStorage</p>
        </div>
      </footer>
    </div>
  );
}
