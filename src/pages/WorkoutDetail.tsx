
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import EmptyState from '@/components/EmptyState';
import { workoutSupabaseService } from '@/services/workoutSupabaseService';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Workout } from '@/utils/workoutData';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState(workout?.exercises || []);

  useEffect(() => {
    if (id) {
      loadWorkout(id);
    }
  }, [id]);

  const loadWorkout = async (workoutId: string) => {
    setLoading(true);
    try {
      const workoutData = await workoutSupabaseService.getWorkoutById(workoutId);
      setWorkout(workoutData);
      setExercises(workoutData?.exercises || []);
    } catch (error) {
      console.error('Error loading workout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft size={18} className="mr-2" />
            Voltar
          </Button>
          <p className="text-gray-600">Carregando treino...</p>
        </div>
      </Layout>
    );
  }

  if (!workout) {
    return (
      <Layout>
        <div className="py-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft size={18} className="mr-2" />
            Voltar
          </Button>
          <EmptyState 
            type="workouts" 
            onAction={() => navigate('/workouts')}
          />
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
      title: "Treino concluído!",
      description: "Parabéns! Seu progresso foi salvo.",
    });
    navigate('/workouts');
  };

  const getWorkoutTypeLabel = (type: string) => {
    switch (type) {
      case 'strength':
        return 'Musculação';
      case 'cardio':
        return 'Cardio';
      case 'flexibility':
        return 'Flexibilidade';
      case 'rest':
        return 'Descanso';
      default:
        return type;
    }
  };

  const date = new Date(workout.date);
  const formattedDate = date.toLocaleDateString('pt-BR', {
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
          Voltar
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

        {exercises.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <h2 className="font-semibold text-lg mb-4">Exercícios</h2>
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
                        <span>{exercise.sets} séries × {exercise.reps} reps</span>
                      )}
                      {exercise.weight && <span> · {exercise.weight} kg</span>}
                      {exercise.duration && <span>{exercise.duration} min</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <EmptyState type="workouts" />
          </div>
        )}

        {isToday && !workout.completed && (
          <Button 
            className="w-full workout-gradient text-white"
            onClick={completeWorkout}
          >
            Concluir Treino
          </Button>
        )}

        {isPast && !workout.completed && !isToday && (
          <div className="text-center">
            <p className="text-gray-500 mb-2">Este treino não foi marcado como concluído.</p>
            <Button variant="outline" onClick={completeWorkout}>
              Marcar como Concluído
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WorkoutDetail;
