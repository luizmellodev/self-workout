
import { supabase } from '@/integrations/supabase/client';
import { Workout, Exercise } from '@/utils/workoutData';
import { v4 as uuidv4 } from "uuid";

export interface SupabaseWorkout {
  id: string;
  name: string;
  description?: string;
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

    async createWorkout(workout: Omit<Workout, "completed" | "type">): Promise<Workout | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }

    try {
      const workoutId = workout.id || uuidv4();

      const { data: createdWorkout, error: workoutError } = await supabase
        .from("workouts")
        .insert({
          id: workoutId,
          name: workout.name,
          user_id: user.id,
          created_at: workout.date, // ou new Date().toISOString() se preferir data atual
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (workoutError) {
        console.error("Error creating workout:", workoutError);
        return null;
      }

      // Inserir exercícios relacionados
      const exercisesToInsert = workout.exercises.map((ex, index) => ({
        id: ex.id || uuidv4(),
        workout_id: workoutId,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || null,
        order_position: index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error: exercisesError } = await supabase
        .from("workout_exercises")
        .insert(exercisesToInsert);

      if (exercisesError) {
        console.error("Error creating workout exercises:", exercisesError);
        return null;
      }

      // Retornar o treino criado no formato esperado
      return {
        id: createdWorkout.id,
        name: createdWorkout.name,
        type: "strength",
        exercises: exercisesToInsert.map((ex) => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || undefined,
          completed: false,
        })),
        completed: false,
        date: createdWorkout.created_at,
      };
    } catch (error) {
      console.error("Unexpected error creating workout:", error);
      return null;
    }
  },

async getWorkoutsByDate(date: Date): Promise<Workout[]> {
  console.log('Fetching workouts for date:', date);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: workouts, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString())
    .order('created_at', { ascending: true });

  if (error) return [];

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
    day: '', // sem mais dia fixo
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
}
,

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
