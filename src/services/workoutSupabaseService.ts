
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
    console.log('Fetching all workouts...');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found');
      return [];
    }

    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workouts:', error);
      return [];
    }

    if (!workouts || workouts.length === 0) {
      console.log('No workouts found for user');
      return [];
    }

    console.log('Found workouts:', workouts);

    // Get exercises for all workouts
    const workoutIds = workouts.map(w => w.id);
    const { data: exercises } = await supabase
      .from('workout_exercises')
      .select('*')
      .in('workout_id', workoutIds)
      .order('order_position');

    console.log('Found exercises:', exercises);

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
    console.log('Fetching workouts for date:', date);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found');
      return [];
    }

    const dayOfWeek = date.getDay();
    console.log('Looking for workouts on day of week:', dayOfWeek);
    
    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .eq('day_of_week', dayOfWeek);

    if (error) {
      console.error('Error fetching workouts by date:', error);
      return [];
    }

    if (!workouts || workouts.length === 0) {
      console.log('No workouts found for this day');
      return [];
    }

    console.log('Found workouts for day:', workouts);

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
    console.log('Fetching workout by id:', id);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found');
      return null;
    }

    const { data: workout, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !workout) {
      console.error('Error fetching workout:', error);
      return null;
    }

    console.log('Found workout:', workout);

    const { data: exercises } = await supabase
      .from('workout_exercises')
      .select('*')
      .eq('workout_id', id)
      .order('order_position');

    console.log('Found exercises for workout:', exercises);

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
    if (dayOfWeek === undefined || dayOfWeek === null) return 'Qualquer dia';
    
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek] || 'Qualquer dia';
  }
};
