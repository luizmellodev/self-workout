
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import WorkoutCard from '@/components/WorkoutCard';
import { getFutureWorkouts, getPastWorkouts, getCurrentWorkout } from '@/utils/workoutData';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Workouts = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const currentWorkout = getCurrentWorkout();
  const pastWorkouts = getPastWorkouts();
  const upcomingWorkouts = getFutureWorkouts();

  return (
    <Layout>
      <div className="py-6">
        <h1 className="mb-6">Your Workouts</h1>

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
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
                  <p className="text-center text-gray-500">No upcoming workouts scheduled.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="today">
            {currentWorkout ? (
              <div className="space-y-4">
                <WorkoutCard workout={currentWorkout} isCurrent={true} />
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">No workout scheduled for today.</p>
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
                  <p className="text-center text-gray-500">No past workouts found.</p>
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
