'use client';

import React, {Fragment} from 'react';
import { useActivities } from '../context/HabitContext';
import { format, parseISO } from 'date-fns';

export default function ActivityList() {
  const { activities, deleteActivity, loading, error } = useActivities();

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

  const getActivityIcon = (activityName: string) => {
    if (activityName === 'Cold Plunge') return '🥶';
    if (activityName === 'Meditation') return '🧘';
    return '📝';
  };

  if (loading && activities.length === 0) {
    return (
      <div className="mt-4 md:mt-6">
        <h2 className="text-xl font-semibold mb-3 md:mb-4 text-white">Your Activities</h2>
        <div className="bg-slate-700 p-6 md:p-8 rounded-lg shadow-lg flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg className="animate-spin mb-3 h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-300">Loading your activities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 md:mt-6">
        <h2 className="text-xl font-semibold mb-3 md:mb-4 text-white">Your Activities</h2>
        <div className="bg-red-500 bg-opacity-20 p-6 rounded-lg border border-red-500 text-center">
          <p className="text-red-100">Error: {error}</p>
          <p className="text-red-200 mt-2">Try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 md:mt-6">
      <h2 className="text-xl font-semibold mb-3 md:mb-4 text-white">Your Activities</h2>

      {activities.length === 0 ? (
        <div className="bg-slate-700 p-6 rounded-lg shadow-lg text-center">
          <p className="text-slate-300">You haven&apos;t tracked any activities yet. Start by adding one above!</p>
        </div>
      ) : (
        <Fragment>
          <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden md:hidden">
            {/* Mobile card view */}
            <div className="divide-y divide-slate-700">
              {sortedActivities.map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getActivityStyle(activity.name)}`}>
                      <span className="mr-1">{getActivityIcon(activity.name)}</span>
                      {activity.name}
                    </span>
                    <button
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this activity?')) {
                          try {
                            await deleteActivity(activity.id);
                          } catch (err) {
                            console.error('Error deleting activity:', err);
                          }
                        }
                      }}
                      className="bg-red-500 active:bg-red-600 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                      disabled={loading}
                    >
                      {loading ? '...' : 'Delete'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="block text-xs text-slate-400">Date</span>
                      {formatDate(activity.date)}
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <span className="block text-xs text-slate-400">Duration</span>
                      {activity.duration} minutes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block bg-slate-800 rounded-lg shadow-lg overflow-hidden">
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
                        <span className="mr-1">{getActivityIcon(activity.name)}</span>
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
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this activity?')) {
                            try {
                              await deleteActivity(activity.id);
                            } catch (err) {
                              console.error('Error deleting activity:', err);
                            }
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                        disabled={loading}
                      >
                        {loading ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Fragment>
      )}
    </div>
  );
}
