
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import WorkoutCard from '@/components/WorkoutCard';
import EmptyState from '@/components/EmptyState';
import { workoutSupabaseService } from '@/services/workoutSupabaseService';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workout } from '@/utils/workoutData';

const Workouts = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      console.log('Loading workouts for workouts page...');
      const allWorkouts = await workoutSupabaseService.getWorkouts();
      console.log('Loaded workouts:', allWorkouts);
      setWorkouts(allWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayWorkouts = () => {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    return workouts.filter(workout => {
      // Check if workout is scheduled for today's day of the week
      const workoutDate = new Date(workout.date);
      return workoutDate.getDay() === todayDayOfWeek;
    });
  };

  const getPastWorkouts = () => {
    // For now, return empty as we don't have completed workouts logic
    // In the future, you could add a 'completed_at' field to track this
    return [];
  };

  const getUpcomingWorkouts = () => {
    // Return all workouts as upcoming for now
    return workouts;
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-6">
          <h1 className="mb-6">Seus Treinos</h1>
          <p className="text-gray-600">Carregando treinos...</p>
        </div>
      </Layout>
    );
  }

  const todayWorkouts = getTodayWorkouts();
  const pastWorkouts = getPastWorkouts();
  const upcomingWorkouts = getUpcomingWorkouts();

  return (
    <Layout>
      <div className="py-6">
        <h1 className="mb-6">Seus Treinos</h1>

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Próximos</TabsTrigger>
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="past">Passados</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingWorkouts.length > 0 ? (
              <div className="space-y-4">
                {upcomingWorkouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <EmptyState 
                    type="workouts" 
                    onAction={() => console.log('Create workout clicked')}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="today">
            {todayWorkouts.length > 0 ? (
              <div className="space-y-4">
                {todayWorkouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} isCurrent={true} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <EmptyState type="today" />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastWorkouts.length > 0 ? (
              <div className="space-y-4">
                {pastWorkouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Nenhum treino passado encontrado.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Workouts;
