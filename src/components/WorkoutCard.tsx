
import React from 'react';
import { Workout } from '@/utils/workoutData';
import { Link } from 'react-router-dom';

interface WorkoutCardProps {
  workout: Workout;
  isCurrent?: boolean;
}

const WorkoutCard = ({ workout, isCurrent = false }: WorkoutCardProps) => {
  const date = new Date(workout.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return (
          <div className="rounded-full bg-workout-accent/10 p-2 flex items-center justify-center">
            <span className="font-bold text-workout-accent">💪</span>
          </div>
        );
      case 'cardio':
        return (
          <div className="rounded-full bg-red-500/10 p-2 flex items-center justify-center">
            <span className="font-bold text-red-500">🏃</span>
          </div>
        );
      case 'flexibility':
        return (
          <div className="rounded-full bg-blue-500/10 p-2 flex items-center justify-center">
            <span className="font-bold text-blue-500">🧘</span>
          </div>
        );
      case 'rest':
        return (
          <div className="rounded-full bg-green-500/10 p-2 flex items-center justify-center">
            <span className="font-bold text-green-500">😌</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Link to={`/workout/${workout.id}`}>
      <div className={`workout-card mb-4 ${isCurrent ? 'border-l-4 border-l-workout-primary' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{workout.name}</h3>
          {getTypeIcon(workout.type)}
        </div>
        <div className="flex justify-between items-center mb-1 text-sm">
          <div className="text-gray-500">{formattedDate}</div>
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            workout.completed 
              ? 'bg-green-100 text-green-800' 
              : isCurrent 
                ? 'bg-workout-primary/20 text-workout-primary animate-pulse-light'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {workout.completed ? 'Completed' : isCurrent ? 'Today' : 'Upcoming'}
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-gray-600">
            {workout.exercises.length} exercises · {workout.day}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default WorkoutCard;
