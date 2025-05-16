
import { supabase } from "@/integrations/supabase/client";
import { Workout, Exercise } from "@/utils/workoutData";

export interface SupabaseWorkout {
  id: string;
  name: string;
  description: string | null;
  day_of_week: number | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  exercises?: SupabaseExercise[];
}

export interface SupabaseExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  notes: string | null;
  order_position: number;
  created_at: string;
  updated_at: string;
  workout_id: string;
}

// Convert from supabase format to our app format
const mapWorkoutFromSupabase = (workout: SupabaseWorkout): Workout => {
  const dayMap: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  return {
    id: workout.id,
    name: workout.name,
    type: determineWorkoutType(workout),
    day: workout.day_of_week !== null ? dayMap[workout.day_of_week] : 'Any day',
    exercises: workout.exercises ? workout.exercises.map(mapExerciseFromSupabase) : [],
    completed: false, // This would need to come from a completed_workouts table in a real app
    date: workout.created_at
  };
};

const determineWorkoutType = (workout: SupabaseWorkout): 'strength' | 'cardio' | 'flexibility' | 'rest' => {
  // This is a simple example - in a real app, you might have a type field in the database
  if (workout.name.toLowerCase().includes('rest')) {
    return 'rest';
  } else if (workout.name.toLowerCase().includes('cardio')) {
    return 'cardio';
  } else if (workout.name.toLowerCase().includes('stretch') || workout.name.toLowerCase().includes('flex')) {
    return 'flexibility';
  } else {
    return 'strength';
  }
};

const mapExerciseFromSupabase = (exercise: SupabaseExercise): Exercise => {
  return {
    id: exercise.id,
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight || undefined,
    completed: false // This would need to come from a completed_exercises table in a real app
  };
};

// Get all workouts for the current user
export const fetchUserWorkouts = async (): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      exercises:workout_exercises(*)
    `)
    .order('day_of_week');

  if (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }

  return (data as SupabaseWorkout[]).map(mapWorkoutFromSupabase);
};

// Get a single workout by ID
export const fetchWorkoutById = async (id: string): Promise<Workout | null> => {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      exercises:workout_exercises(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching workout:', error);
    return null;
  }

  return mapWorkoutFromSupabase(data as SupabaseWorkout);
};

// Create a new workout
export const createWorkout = async (workout: {
  name: string;
  description?: string;
  day_of_week?: number;
}): Promise<string | null> => {
  const { data, error } = await supabase
    .from('workouts')
    .insert([workout])
    .select();

  if (error) {
    console.error('Error creating workout:', error);
    return null;
  }

  return data[0].id;
};

// Update an existing workout
export const updateWorkout = async (
  id: string,
  workout: {
    name?: string;
    description?: string;
    day_of_week?: number;
  }
): Promise<boolean> => {
  const { error } = await supabase
    .from('workouts')
    .update(workout)
    .eq('id', id);

  if (error) {
    console.error('Error updating workout:', error);
    return false;
  }

  return true;
};

// Delete a workout
export const deleteWorkout = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting workout:', error);
    return false;
  }

  return true;
};

// Add an exercise to a workout
export const addExerciseToWorkout = async (
  workoutId: string,
  exercise: {
    name: string;
    sets?: number;
    reps?: number;
    weight?: number;
    notes?: string;
  }
): Promise<string | null> => {
  // First, get the current highest order_position
  const { data: exercises, error: fetchError } = await supabase
    .from('workout_exercises')
    .select('order_position')
    .eq('workout_id', workoutId)
    .order('order_position', { ascending: false })
    .limit(1);

  const newOrderPosition = exercises && exercises.length > 0 
    ? exercises[0].order_position + 1 
    : 0;

  const { data, error } = await supabase
    .from('workout_exercises')
    .insert([{
      ...exercise,
      workout_id: workoutId,
      order_position: newOrderPosition
    }])
    .select();

  if (error || fetchError) {
    console.error('Error adding exercise:', error || fetchError);
    return null;
  }

  return data[0].id;
};

// Update an exercise
export const updateExercise = async (
  id: string,
  exercise: {
    name?: string;
    sets?: number;
    reps?: number;
    weight?: number;
    notes?: string;
    order_position?: number;
  }
): Promise<boolean> => {
  const { error } = await supabase
    .from('workout_exercises')
    .update(exercise)
    .eq('id', id);

  if (error) {
    console.error('Error updating exercise:', error);
    return false;
  }

  return true;
};

// Delete an exercise
export const deleteExercise = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('workout_exercises')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting exercise:', error);
    return false;
  }

  return true;
};
