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
  const [hasLoaded, setHasLoaded] = useState(false);
  const cached = localStorage.getItem("workouts");
  const parsedWorkouts: Workout[] = cached ? JSON.parse(cached) : [];
  useEffect(() => {
    if (user && !hasLoaded) {
      if (parsedWorkouts.length > 0) {
        setAllWorkouts(parsedWorkouts);
        setLoading(false);
        return;
      } else {
        loadWorkouts().then(() => {
          setHasLoaded(true);
        });
      }
    }
  }, [user, hasLoaded]);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const allWorkoutsData = await workoutSupabaseService.getWorkouts();
      setAllWorkouts(allWorkoutsData);
      setUpcomingWorkouts(allWorkoutsData.slice(0, 3));
      console.log("All workouts:", allWorkoutsData);

      const today = new Date();
      const todayStr = today.toDateString();
      const selectedStr = selectedDate.toDateString();

      let todayWorkoutsData: Workout[] = [];
      let selectedWorkoutsData: Workout[] = [];

      if (todayStr === selectedStr) {
        todayWorkoutsData = await workoutSupabaseService.getWorkoutsByDate(
          today
        );
        selectedWorkoutsData = todayWorkoutsData;
      } else {
        todayWorkoutsData = await workoutSupabaseService.getWorkoutsByDate(
          today
        );
        selectedWorkoutsData = await workoutSupabaseService.getWorkoutsByDate(
          selectedDate
        );
      }

      setTodayWorkouts(todayWorkoutsData);
      setSelectedDateWorkouts(selectedWorkoutsData);

      // Salva no cache apenas os treinos gerais (semporais)
      localStorage.setItem("workouts", JSON.stringify(allWorkoutsData));
    } catch (error) {
      console.error("Error loading workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    console.log("Date selected:", date);
    setSelectedDate(date);

    const selectedDateStr = date.toDateString();

    const filteredWorkouts = allWorkouts.filter((workout) => {
      const workoutDateStr = new Date(workout.date).toDateString();
      return workoutDateStr === selectedDateStr;
    });

    console.log("Filtered workouts from cache:", filteredWorkouts);
    setSelectedDateWorkouts(filteredWorkouts);
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

        <Calendar onDateSelect={handleDateSelect} workouts={parsedWorkouts} />

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
