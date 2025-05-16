
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
  day: string;
  exercises: Exercise[];
  completed: boolean;
  date: string; // ISO string
}

// Sample workouts data
export const workouts: Workout[] = [
  {
    id: '1',
    name: 'Upper Body Focus',
    type: 'strength',
    day: 'Monday',
    exercises: [
      { id: '1-1', name: 'Bench Press', sets: 4, reps: 10, weight: 60 },
      { id: '1-2', name: 'Pull-ups', sets: 3, reps: 8 },
      { id: '1-3', name: 'Military Press', sets: 3, reps: 10, weight: 40 },
      { id: '1-4', name: 'Bicep Curls', sets: 3, reps: 12, weight: 15 },
    ],
    completed: true,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: '2',
    name: 'Leg Day',
    type: 'strength',
    day: 'Wednesday',
    exercises: [
      { id: '2-1', name: 'Squats', sets: 4, reps: 10, weight: 80 },
      { id: '2-2', name: 'Leg Press', sets: 3, reps: 12, weight: 120 },
      { id: '2-3', name: 'Lunges', sets: 3, reps: 10, weight: 20 },
      { id: '2-4', name: 'Calf Raises', sets: 4, reps: 15, weight: 30 },
    ],
    completed: false,
    date: new Date().toISOString(), // Today
  },
  {
    id: '3',
    name: 'Cardio Blast',
    type: 'cardio',
    day: 'Friday',
    exercises: [
      { id: '3-1', name: 'Treadmill Run', duration: 20 },
      { id: '3-2', name: 'Rowing Machine', duration: 10 },
      { id: '3-3', name: 'Jump Rope', duration: 5 },
      { id: '3-4', name: 'Cycling', duration: 15 },
    ],
    completed: false,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
  },
  {
    id: '4',
    name: 'Rest Day',
    type: 'rest',
    day: 'Sunday',
    exercises: [
      { id: '4-1', name: 'Light Stretching', duration: 15 },
      { id: '4-2', name: 'Meditation', duration: 10 },
    ],
    completed: false,
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
  },
  {
    id: '5',
    name: 'Full Body Workout',
    type: 'strength',
    day: 'Monday',
    exercises: [
      { id: '5-1', name: 'Deadlifts', sets: 4, reps: 8, weight: 100 },
      { id: '5-2', name: 'Push-ups', sets: 3, reps: 15 },
      { id: '5-3', name: 'Pull-ups', sets: 3, reps: 8 },
      { id: '5-4', name: 'Squats', sets: 4, reps: 10, weight: 80 },
    ],
    completed: false,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  },
];

export const getWorkoutsByDate = (date: Date): Workout[] => {
  const dateString = date.toISOString().split('T')[0];
  return workouts.filter(workout => 
    workout.date.split('T')[0] === dateString
  );
};

export const getPastWorkouts = (): Workout[] => {
  const now = new Date();
  return workouts
    .filter(workout => new Date(workout.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getFutureWorkouts = (): Workout[] => {
  const now = new Date();
  return workouts
    .filter(workout => new Date(workout.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getCurrentWorkout = (): Workout | undefined => {
  const today = new Date().toISOString().split('T')[0];
  return workouts.find(workout => 
    workout.date.split('T')[0] === today
  );
};

export const getWorkoutById = (id: string): Workout | undefined => {
  return workouts.find(workout => workout.id === id);
};

export const getRecommendedWorkouts = (): Workout[] => {
  // In a real app, this would be based on user preferences, history, etc.
  // For now, just return some future workouts as recommendations
  return getFutureWorkouts().slice(0, 2);
};
