'use client';

import React from 'react';
import { useActivities } from '../context/HabitContext';
import { format, parseISO } from 'date-fns';

export default function ActivityList() {
  const { activities, deleteActivity } = useActivities();

  // Sort activities by date (newest first)
  const sortedActivities = [...activities].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP'); // e.g., "April 29, 2023"
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getActivityStyle = (activityName: string) => {
    if (activityName === 'Cold Plunge') {
      return 'bg-blue-500 text-white';
    } else if (activityName === 'Meditation') {
      return 'bg-purple-500 text-white';
    }
    return 'bg-gray-500 text-white';
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Activities</h2>
      {activities.length === 0 ? (
        <div className="bg-slate-700 p-6 rounded-lg shadow-lg text-center">
          <p className="text-slate-300">You haven&apos;t tracked any activities yet. Start by adding one above!</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-slate-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Activity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sortedActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getActivityStyle(activity.name)}`}>
                      {activity.name === 'Cold Plunge' && <span className="mr-1">❄️</span>}
                      {activity.name === 'Meditation' && <span className="mr-1">🧘</span>}
                      {activity.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {formatDate(activity.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {activity.duration} minutes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => deleteActivity(activity.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
