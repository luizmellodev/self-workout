
export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'rest';

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // in minutes
  weight?: number; // in kg
  completed?: boolean;
}

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  exercises: Exercise[];
  completed: boolean;
  date: string; // ISO string
}


const normalizeDate = (date: Date): number => {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

export const getWorkoutsByDate = (date: Date, workouts: Workout[]): Workout[] => {
  const target = normalizeDate(date);
  return workouts.filter(workout => normalizeDate(new Date(workout.date)) === target);
};

export const getPastWorkouts = (workouts: Workout[]): Workout[] => {
  const now = new Date();
  return workouts
    .filter(workout => new Date(workout.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getFutureWorkouts = ( workouts: Workout[]): Workout[] => {
  const now = new Date();
  return workouts
    .filter(workout => new Date(workout.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getCurrentWorkout = ( workouts: Workout[]): Workout | undefined => {
  const today = new Date().toISOString().split('T')[0];
  return workouts.find(workout => 
    workout.date.split('T')[0] === today
  );
};

export const getWorkoutById = (id: string,  workouts: Workout[]): Workout | undefined => {
  return workouts.find(workout => workout.id === id);
};