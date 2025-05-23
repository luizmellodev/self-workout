
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import WorkoutCard from '@/components/WorkoutCard';
import Calendar from '@/components/Calendar';
import EmptyState from '@/components/EmptyState';
import { workoutSupabaseService } from '@/services/workoutSupabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { Workout } from '@/utils/workoutData';

const Index = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState<Workout[]>([]);
  const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<Workout[]>([]);
  const [recommendations, setRecommendations] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const allWorkouts = await workoutSupabaseService.getWorkouts();
      
      // Today's workouts
      const today = new Date();
      const todayWorkoutsData = await workoutSupabaseService.getWorkoutsByDate(today);
      setTodayWorkouts(todayWorkoutsData);
      
      // Selected date workouts (initially today)
      const selectedWorkoutsData = await workoutSupabaseService.getWorkoutsByDate(selectedDate);
      setSelectedDateWorkouts(selectedWorkoutsData);
      
      // Mock upcoming and recommendations (you can implement these later)
      setUpcomingWorkouts(allWorkouts.slice(0, 3));
      setRecommendations(allWorkouts.slice(0, 2));
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    const workouts = await workoutSupabaseService.getWorkoutsByDate(date);
    setSelectedDateWorkouts(workouts);
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Bem-vindo ao FitTrack</h1>
            <p className="text-gray-600">Por favor, faça login para acessar seus treinos</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-600">Carregando treinos...</p>
        </div>
      </Layout>
    );
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <Layout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="mb-2">FitTrack</h1>
          <p className="text-gray-600">Acompanhe, planeje e otimize seus treinos</p>
        </div>

        <Calendar onDateSelect={handleDateSelect} />

        {selectedDateWorkouts.length > 0 ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {isToday ? "Treino de Hoje" : `Treino em ${selectedDate.toLocaleDateString()}`}
            </h2>
            {selectedDateWorkouts.map(workout => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                isCurrent={isToday} 
              />
            ))}
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {isToday ? "Treino de Hoje" : `Treino em ${selectedDate.toLocaleDateString()}`}
            </h2>
            <EmptyState 
              type={isToday ? "today" : "calendar"} 
              onAction={() => console.log('Add workout clicked')}
            />
          </div>
        )}

        {!isToday && todayWorkouts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Treino de Hoje</h2>
            {todayWorkouts.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} isCurrent={true} />
            ))}
          </div>
        )}

        {upcomingWorkouts.length > 0 && !isToday && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Próximos Treinos</h2>
            <WorkoutCard workout={upcomingWorkouts[0]} />
            {upcomingWorkouts.length > 1 && (
              <div className="text-center mt-2">
                <a href="/workouts" className="text-workout-primary text-sm font-medium">
                  Ver todos ({upcomingWorkouts.length}) próximos treinos
                </a>
              </div>
            )}
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Recomendados Para Você</h2>
            {recommendations.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}

        {selectedDateWorkouts.length === 0 && todayWorkouts.length === 0 && upcomingWorkouts.length === 0 && (
          <EmptyState 
            type="workouts" 
            onAction={() => console.log('Create workout clicked')}
          />
        )}
      </div>
    </Layout>
  );
};

export default Index;
