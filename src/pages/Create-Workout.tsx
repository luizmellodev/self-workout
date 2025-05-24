import React, { useState, useEffect } from "react";
import { workoutSupabaseService } from "@/services/workoutSupabaseService";
import { Workout, Exercise } from "@/utils/workoutData";

const CreateWorkout = () => {
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  // Novo estado para data do treino
  const [date, setDate] = useState(() => {
    const today = new Date();
    // Formatar para YYYY-MM-DD
    return today.toISOString().split("T")[0];
  });

  // Estado para popup de notificação
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // resto do código igual ...

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: "",
        name: "",
        sets: 3,
        reps: 10,
        weight: undefined,
        completed: false,
      },
    ]);
  };

  const updateExercise = (
    index: number,
    field: keyof Exercise,
    value: string | number | boolean | undefined
  ) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast("Informe o nome do treino", "error");
      return;
    }
    if (exercises.length === 0) {
      showToast("Adicione ao menos um exercício", "error");
      return;
    }
    if (!date) {
      showToast("Informe a data do treino", "error");
      return;
    }

    setLoading(true);

    const workoutToCreate: Omit<Workout, "completed" | "type"> = {
      id: "",
      name,
      exercises,
      // transformar date YYYY-MM-DD para ISO completo para guardar no banco
      date: new Date(date).toISOString(),
    };

    const created = await workoutSupabaseService.createWorkout(workoutToCreate);
    setLoading(false);

    if (created) {
      showToast("Treino criado com sucesso!", "success");
      setName("");
      setExercises([]);
      setDate(new Date().toISOString().split("T")[0]); // resetar para hoje
    } else {
      showToast("Erro ao criar treino.", "error");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 relative">
      {/* Botão de voltar */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 focus:outline-none"
        aria-label="Voltar"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Voltar
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Criar novo treino
      </h2>

      <label className="block mb-5">
        <span className="text-gray-700 font-semibold mb-1 block">
          Nome do treino
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition duration-200"
          placeholder="Ex: Treino de força"
        />
      </label>

      {/* Novo input para data */}
      <label className="block mb-6">
        <span className="text-gray-700 font-semibold mb-1 block">
          Data do treino
        </span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition duration-200"
          min={new Date().toISOString().split("T")[0]} // opcional: data mínima hoje
        />
      </label>

      {/* resto dos exercícios e botão igual */}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Exercícios</h3>
        {exercises.map((ex, i) => (
          <div
            key={i}
            className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm relative
                       hover:shadow-md transition-shadow duration-300 bg-gray-50"
          >
            <button
              onClick={() => removeExercise(i)}
              className="absolute top-3 right-3 text-red-600 text-xl font-bold 
                         hover:text-red-800 transition-colors duration-200 cursor-pointer"
              title="Remover exercício"
              aria-label="Remover exercício"
            >
              &times;
            </button>

            <input
              type="text"
              placeholder="Nome do exercício"
              value={ex.name}
              onChange={(e) => updateExercise(i, "name", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3
                         focus:outline-none focus:ring-2 focus:ring-blue-400
                         transition duration-200"
            />
            <div className="flex space-x-3">
              <input
                type="number"
                placeholder="Séries"
                value={ex.sets}
                min={1}
                onChange={(e) =>
                  updateExercise(i, "sets", Number(e.target.value))
                }
                className="w-1/3 border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-400
                           transition duration-200"
              />
              <input
                type="number"
                placeholder="Repetições"
                value={ex.reps}
                min={1}
                onChange={(e) =>
                  updateExercise(i, "reps", Number(e.target.value))
                }
                className="w-1/3 border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-400
                           transition duration-200"
              />
              <input
                type="number"
                placeholder="Peso (kg)"
                value={ex.weight ?? ""}
                min={0}
                onChange={(e) =>
                  updateExercise(
                    i,
                    "weight",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-1/3 border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-400
                           transition duration-200"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addExercise}
          className="inline-block mt-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-md
                     hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          + Adicionar exercício
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-md
                   hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
      >
        {loading ? "Salvando..." : "Salvar treino"}
      </button>

      {/* Toast popup */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg
            ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-600 text-white"
            }
            animate-fadeInDown`}
          role="alert"
        >
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default CreateWorkout;
