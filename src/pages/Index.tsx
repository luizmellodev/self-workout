
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import WorkoutCard from '@/components/WorkoutCard';
import Calendar from '@/components/Calendar';
import { getCurrentWorkout, getFutureWorkouts, getRecommendedWorkouts, getWorkoutsByDate } from '@/utils/workoutData';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState(getWorkoutsByDate(selectedDate));
  
  const currentWorkout = getCurrentWorkout();
  const futureWorkouts = getFutureWorkouts();
  const recommendations = getRecommendedWorkouts();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedDateWorkouts(getWorkoutsByDate(date));
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="mb-2">FitTrack</h1>
          <p className="text-gray-600">Track, plan and optimize your workouts</p>
        </div>

        <Calendar onDateSelect={handleDateSelect} />

        {selectedDateWorkouts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {selectedDate.toLocaleDateString() === new Date().toLocaleDateString()
                ? "Today's Workout"
                : `Workout on ${selectedDate.toLocaleDateString()}`}
            </h2>
            {selectedDateWorkouts.map(workout => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                isCurrent={selectedDate.toLocaleDateString() === new Date().toLocaleDateString()} 
              />
            ))}
          </div>
        )}

        {currentWorkout && selectedDate.toLocaleDateString() !== new Date().toLocaleDateString() && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Today's Workout</h2>
            <WorkoutCard workout={currentWorkout} isCurrent={true} />
          </div>
        )}

        {futureWorkouts.length > 0 && selectedDate.toLocaleDateString() !== new Date().toLocaleDateString() && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Upcoming Workouts</h2>
            <WorkoutCard workout={futureWorkouts[0]} />
            {futureWorkouts.length > 1 && (
              <div className="text-center mt-2">
                <a href="/workouts" className="text-workout-primary text-sm font-medium">
                  View all ({futureWorkouts.length}) upcoming workouts
                </a>
              </div>
            )}
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Recommended For You</h2>
            {recommendations.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
