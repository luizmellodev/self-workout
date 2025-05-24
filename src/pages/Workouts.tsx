import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import WorkoutCard from "@/components/WorkoutCard";
import EmptyState from "@/components/EmptyState";
import { workoutSupabaseService } from "@/services/workoutSupabaseService";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Workout } from "@/utils/workoutData";
import { useNavigate } from "react-router-dom"; // <-- importar useNavigate

const Workouts = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- criar navigate

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      console.log("Loading workouts for workouts page...");
      const allWorkouts = await workoutSupabaseService.getWorkouts();
      console.log("Loaded workouts:", allWorkouts);
      setWorkouts(allWorkouts);
    } catch (error) {
      console.error("Error loading workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayWorkouts = () => {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate.getDay() === todayDayOfWeek;
    });
  };

  const getPastWorkouts = () => {
    return [];
  };

  const getUpcomingWorkouts = () => {
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
        {/* Header com título e botão lado a lado */}
        <div className="flex items-center justify-between mb-6">
          <h1>Seus Treinos</h1>
          <button
            onClick={() => navigate("/create")}
            className="bg-workout-primary text-white px-4 py-2 rounded-md hover:bg-workout-primary-dark transition"
          >
            Novo treino
          </button>
        </div>

        <Tabs
          defaultValue="upcoming"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Próximos</TabsTrigger>
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="past">Passados</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingWorkouts.length > 0 ? (
              <div className="space-y-4">
                {upcomingWorkouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <EmptyState
                    type="workouts"
                    onAction={() => navigate("/workouts/create")} // Também no EmptyState
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="today">
            {todayWorkouts.length > 0 ? (
              <div className="space-y-4">
                {todayWorkouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    isCurrent={true}
                  />
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
                {pastWorkouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">
                    Nenhum treino passado encontrado.
                  </p>
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
