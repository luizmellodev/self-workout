
import { supabase } from '@/integrations/supabase/client';
import { Workout, Exercise } from '@/utils/workoutData';

export interface SupabaseWorkout {
  id: string;
  name: string;
  description?: string;
  day_of_week?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseWorkoutExercise {
  id: string;
  workout_id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export const workoutSupabaseService = {
  async getWorkouts(): Promise<Workout[]> {
    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workouts:', error);
      return [];
    }

    if (!workouts || workouts.length === 0) {
      return [];
    }

    // Get exercises for all workouts
    const workoutIds = workouts.map(w => w.id);
    const { data: exercises } = await supabase
      .from('workout_exercises')
      .select('*')
      .in('workout_id', workoutIds)
      .order('order_position');

    // Convert to app format
    return workouts.map(workout => ({
      id: workout.id,
      name: workout.name,
      type: 'strength' as const,
      day: this.getDayName(workout.day_of_week),
      exercises: exercises
        ?.filter(ex => ex.workout_id === workout.id)
        .map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || undefined,
          completed: false
        })) || [],
      completed: false,
      date: workout.created_at
    }));
  },

  async getWorkoutsByDate(date: Date): Promise<Workout[]> {
    const dayOfWeek = date.getDay();
    
    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('day_of_week', dayOfWeek);

    if (error) {
      console.error('Error fetching workouts by date:', error);
      return [];
    }

    if (!workouts || workouts.length === 0) {
      return [];
    }

    // Get exercises for these workouts
    const workoutIds = workouts.map(w => w.id);
    const { data: exercises } = await supabase
      .from('workout_exercises')
      .select('*')
      .in('workout_id', workoutIds)
      .order('order_position');

    return workouts.map(workout => ({
      id: workout.id,
      name: workout.name,
      type: 'strength' as const,
      day: this.getDayName(workout.day_of_week),
      exercises: exercises
        ?.filter(ex => ex.workout_id === workout.id)
        .map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || undefined,
          completed: false
        })) || [],
      completed: false,
      date: date.toISOString()
    }));
  },

  async getWorkoutById(id: string): Promise<Workout | null> {
    const { data: workout, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !workout) {
      console.error('Error fetching workout:', error);
      return null;
    }

    const { data: exercises } = await supabase
      .from('workout_exercises')
      .select('*')
      .eq('workout_id', id)
      .order('order_position');

    return {
      id: workout.id,
      name: workout.name,
      type: 'strength' as const,
      day: this.getDayName(workout.day_of_week),
      exercises: exercises?.map(ex => ({
        id: ex.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || undefined,
        completed: false
      })) || [],
      completed: false,
      date: workout.created_at
    };
  },

  getDayName(dayOfWeek?: number): string {
    if (dayOfWeek === undefined || dayOfWeek === null) return 'Any day';
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Any day';
  }
};
