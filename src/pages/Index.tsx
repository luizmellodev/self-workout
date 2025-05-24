import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import WorkoutCard from "@/components/WorkoutCard";
import Calendar from "@/components/Calendar";
import EmptyState from "@/components/EmptyState";
import { workoutSupabaseService } from "@/services/workoutSupabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { Workout } from "@/utils/workoutData";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState<Workout[]>(
    []
  );
  const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      console.log("Loading workouts for home page...");

      const allWorkoutsData = await workoutSupabaseService.getWorkouts();
      setAllWorkouts(allWorkoutsData);
      setUpcomingWorkouts(allWorkoutsData.slice(0, 3));
      console.log("All workouts:", allWorkoutsData);

      // Today's workouts
      const today = new Date();
      const todayWorkoutsData = await workoutSupabaseService.getWorkoutsByDate(
        today
      );
      console.log("Today workouts:", todayWorkoutsData);
      setTodayWorkouts(todayWorkoutsData);

      // Selected date workouts (initially today)
      const selectedWorkoutsData =
        await workoutSupabaseService.getWorkoutsByDate(selectedDate);
      console.log("Selected date workouts:", selectedWorkoutsData);
      setSelectedDateWorkouts(selectedWorkoutsData);

      // Get all workouts for upcoming section
      const allWorkouts = await workoutSupabaseService.getWorkouts();
      console.log("All workouts:", allWorkouts);
      setUpcomingWorkouts(allWorkouts.slice(0, 3));
    } catch (error) {
      console.error("Error loading workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    console.log("Date selected:", date);
    setSelectedDate(date);
    const workouts = await workoutSupabaseService.getWorkoutsByDate(date);
    console.log("Workouts for selected date:", workouts);
    setSelectedDateWorkouts(workouts);
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Bem-vindo ao FitTrack</h1>
            <p className="text-gray-600">
              Por favor, faça login para acessar seus treinos
            </p>
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
          <p className="text-gray-600">
            Acompanhe, planeje e otimize seus treinos
          </p>
        </div>

        <Calendar onDateSelect={handleDateSelect} workouts={allWorkouts} />

        {selectedDateWorkouts.length > 0 ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {isToday
                ? "Treino de Hoje"
                : `Treino em ${selectedDate.toLocaleDateString("pt-BR")}`}
            </h2>
            {selectedDateWorkouts.map((workout) => (
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
              {isToday
                ? "Treino de Hoje"
                : `Treino em ${selectedDate.toLocaleDateString("pt-BR")}`}
            </h2>
            <EmptyState
              type={isToday ? "today" : "calendar"}
              onAction={() => navigate("/create")}
            />
          </div>
        )}

        {!isToday && todayWorkouts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Treino de Hoje</h2>
            {todayWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                isCurrent={true}
              />
            ))}
          </div>
        )}

        {upcomingWorkouts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Seus Treinos</h2>
            {upcomingWorkouts.slice(0, 2).map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
            {upcomingWorkouts.length > 2 && (
              <div className="text-center mt-4">
                <a
                  href="/workouts"
                  className="text-workout-primary text-sm font-medium"
                >
                  Ver todos ({upcomingWorkouts.length}) treinos
                </a>
              </div>
            )}
          </div>
        )}

        {selectedDateWorkouts.length === 0 &&
          todayWorkouts.length === 0 &&
          upcomingWorkouts.length === 0 && (
            <EmptyState type="workouts" onAction={() => navigate("/create")} />
          )}
      </div>
    </Layout>
  );
};

export default Index;
