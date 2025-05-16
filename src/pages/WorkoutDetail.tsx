
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { getWorkoutById } from '@/utils/workoutData';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const workout = getWorkoutById(id || '');
  const [exercises, setExercises] = useState(workout?.exercises || []);

  if (!workout) {
    return (
      <Layout>
        <div className="py-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold mb-4">Workout not found</h2>
        </div>
      </Layout>
    );
  }

  const handleExerciseToggle = (exerciseId: string) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId
          ? { ...exercise, completed: !exercise.completed }
          : exercise
      )
    );
  };

  const completeWorkout = () => {
    toast({
      title: "Workout completed!",
      description: "Great job! Your progress has been saved.",
    });
    // In a real app, this would save to the backend
    navigate('/workouts');
  };

  const getWorkoutTypeLabel = (type: string) => {
    switch (type) {
      case 'strength':
        return 'Strength Training';
      case 'cardio':
        return 'Cardio';
      case 'flexibility':
        return 'Flexibility';
      case 'rest':
        return 'Rest Day';
      default:
        return type;
    }
  };

  const date = new Date(workout.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const isToday = new Date().toDateString() === date.toDateString();
  const isPast = date < new Date();

  return (
    <Layout>
      <div className="py-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="mb-1">{workout.name}</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm bg-workout-light text-workout-primary px-2 py-1 rounded-full">
              {getWorkoutTypeLabel(workout.type)}
            </span>
            <span className="text-sm text-gray-600">{formattedDate}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h2 className="font-semibold text-lg mb-4">Exercises</h2>
          <div className="space-y-4">
            {exercises.map(exercise => (
              <div key={exercise.id} className="flex items-center p-3 rounded-lg border border-gray-100">
                <Checkbox
                  id={exercise.id}
                  checked={!!exercise.completed}
                  onCheckedChange={() => handleExerciseToggle(exercise.id)}
                  className="mr-3"
                  disabled={workout.completed || !isToday}
                />
                <div className="flex-grow">
                  <label 
                    htmlFor={exercise.id} 
                    className={`font-medium ${exercise.completed ? 'line-through text-gray-400' : ''}`}
                  >
                    {exercise.name}
                  </label>
                  <div className="text-sm text-gray-500">
                    {exercise.sets && exercise.reps && (
                      <span>{exercise.sets} sets × {exercise.reps} reps</span>
                    )}
                    {exercise.weight && <span> · {exercise.weight} kg</span>}
                    {exercise.duration && <span>{exercise.duration} min</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isToday && !workout.completed && (
          <Button 
            className="w-full workout-gradient text-white"
            onClick={completeWorkout}
          >
            Complete Workout
          </Button>
        )}

        {isPast && !workout.completed && !isToday && (
          <div className="text-center">
            <p className="text-gray-500 mb-2">This workout wasn't marked as completed.</p>
            <Button variant="outline" onClick={completeWorkout}>
              Mark as Completed
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WorkoutDetail;
