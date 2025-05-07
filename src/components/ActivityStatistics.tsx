'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Activity } from '../types/habit';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityStatisticsProps {
  activities: Activity[];
}

export default function ActivityStatistics({ activities }: ActivityStatisticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const coldPlungeActivities = activities.filter(activity => activity.name === 'Cold Plunge');
  const meditationActivities = activities.filter(activity => activity.name === 'Meditation');

  const totalColdPlungeDuration = coldPlungeActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const totalMeditationDuration = meditationActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const totalDuration = totalColdPlungeDuration + totalMeditationDuration;

  // Filter activities based on selected timeframe
  const getFilteredActivities = () => {
    const now = new Date();
    switch (selectedTimeframe) {
      case 'week': {
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        return activities.filter(activity => {
          const activityDate = parseISO(activity.date);
          return activityDate >= weekStart;
        });
      }
      case 'month': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return activities.filter(activity => {
          const activityDate = parseISO(activity.date);
          return activityDate >= monthStart;
        });
      }
      default:
        return activities;
    }
  };

  // Prepare daily activity data for charts
  const getDailyActivityData = () => {
    const filteredActivities = getFilteredActivities();

    // Determine the date range
    let startDate, endDate;
    const now = new Date();

    if (selectedTimeframe === 'week') {
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
    } else if (selectedTimeframe === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      // For 'all', use the earliest and latest activity dates or fallback to last 30 days
      if (filteredActivities.length > 0) {
        const dates = filteredActivities.map(a => parseISO(a.date));
        startDate = new Date(Math.min(...dates.map(d => d.getTime())));
        endDate = new Date(Math.max(...dates.map(d => d.getTime())));
      } else {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        endDate = now;
      }
    }

    // Create array of all dates in the range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Initialize data for each date
    const dailyData = dateRange.map(date => {
      const coldPlungeMinutes = filteredActivities
        .filter(a => a.name === 'Cold Plunge' && isSameDay(parseISO(a.date), date))
        .reduce((sum, a) => sum + a.duration, 0);

      const meditationMinutes = filteredActivities
        .filter(a => a.name === 'Meditation' && isSameDay(parseISO(a.date), date))
        .reduce((sum, a) => sum + a.duration, 0);

      return {
        date,
        dateString: format(date, 'MMM dd'),
        coldPlungeMinutes,
        meditationMinutes,
        totalMinutes: coldPlungeMinutes + meditationMinutes
      };
    });

    return dailyData;
  };

  const dailyData = getDailyActivityData();

  // Chart configuration
  const lineChartData = {
    labels: dailyData.map(d => d.dateString),
    datasets: [
      {
        label: 'Cold Plunge',
        data: dailyData.map(d => d.coldPlungeMinutes),
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Meditation',
        data: dailyData.map(d => d.meditationMinutes),
        borderColor: 'rgb(168, 85, 247)', // purple-500
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        tension: 0.3,
      }
    ],
  };

  const barChartData = {
    labels: dailyData.map(d => d.dateString),
    datasets: [
      {
        label: 'Total Minutes',
        data: dailyData.map(d => d.totalMinutes),
        backgroundColor: 'rgba(52, 211, 153, 0.6)', // green-400
        borderColor: 'rgb(16, 185, 129)', // green-500
        borderWidth: 1,
      }
    ],
  };

  const pieChartData = {
    labels: ['Cold Plunge', 'Meditation'],
    datasets: [
      {
        data: [totalColdPlungeDuration, totalMeditationDuration],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(168, 85, 247, 0.8)', // purple
        ],
        borderColor: [
          'rgb(30, 64, 175)', // blue-800
          'rgb(107, 33, 168)', // purple-800
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(203, 213, 225)' // slate-300
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.2)' // slate-600 with low opacity
        }
      },
      x: {
        ticks: {
          color: 'rgb(203, 213, 225)' // slate-300
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.2)' // slate-600 with low opacity
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgb(203, 213, 225)' // slate-300
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)', // slate-900 with opacity
        titleColor: 'rgb(241, 245, 249)', // slate-100
        bodyColor: 'rgb(241, 245, 249)', // slate-100
        borderColor: 'rgb(51, 65, 85)', // slate-700
        borderWidth: 1
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(203, 213, 225)' // slate-300
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)', // slate-900 with opacity
        titleColor: 'rgb(241, 245, 249)', // slate-100
        bodyColor: 'rgb(241, 245, 249)', // slate-100
        borderColor: 'rgb(51, 65, 85)', // slate-700
        borderWidth: 1
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 rounded-lg p-6 shadow-lg">
          <p className="text-sm text-blue-100 uppercase tracking-wider">Cold Plunge</p>
          <h3 className="text-3xl font-bold text-white mt-2">{totalColdPlungeDuration} mins</h3>
          <p className="text-blue-200 mt-1">Total Duration</p>
          <p className="text-sm text-blue-200 mt-3">
            {coldPlungeActivities.length} sessions recorded
          </p>
        </div>

        <div className="bg-purple-600 rounded-lg p-6 shadow-lg">
          <p className="text-sm text-purple-100 uppercase tracking-wider">Meditation</p>
          <h3 className="text-3xl font-bold text-white mt-2">{totalMeditationDuration} mins</h3>
          <p className="text-purple-200 mt-1">Total Duration</p>
          <p className="text-sm text-purple-200 mt-3">
            {meditationActivities.length} sessions recorded
          </p>
        </div>

        <div className="bg-green-600 rounded-lg p-6 shadow-lg">
          <p className="text-sm text-green-100 uppercase tracking-wider">Combined Total</p>
          <h3 className="text-3xl font-bold text-white mt-2">{totalDuration} mins</h3>
          <p className="text-green-200 mt-1">All Activities</p>
          <p className="text-sm text-green-200 mt-3">
            {activities.length} total sessions
          </p>
        </div>
      </div>

      {/* Time Filter */}
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedTimeframe('week')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedTimeframe === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedTimeframe('month')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedTimeframe === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedTimeframe('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedTimeframe === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="bg-slate-700 p-6 rounded-lg shadow-lg text-center">
          <p className="text-slate-300">No activity data available. Start tracking to see your statistics!</p>
        </div>
      ) : (
        <>
          {/* Line Chart - Activity Duration Over Time */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-medium text-white mb-4">Activity Duration Over Time</h3>
            <div className="h-80">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          {/* Bar Chart - Daily Total */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-medium text-white mb-4">Daily Total Minutes</h3>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Pie Chart - Activity Distribution */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-medium text-white mb-4">Activity Distribution</h3>
            <div className="h-80">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
