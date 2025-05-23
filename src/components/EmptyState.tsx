
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, Dumbbell } from 'lucide-react';

interface EmptyStateProps {
  type: 'workouts' | 'today' | 'calendar';
  onAction?: () => void;
}

const EmptyState = ({ type, onAction }: EmptyStateProps) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'workouts':
        return {
          icon: <Dumbbell size={48} className="text-gray-400" />,
          title: 'Nenhum treino encontrado',
          description: 'Você ainda não tem treinos cadastrados. Que tal criar seu primeiro treino?',
          actionLabel: 'Criar Treino'
        };
      case 'today':
        return {
          icon: <Calendar size={48} className="text-gray-400" />,
          title: 'Nenhum treino para hoje',
          description: 'Você não tem treinos agendados para hoje. Descanse ou adicione um treino!',
          actionLabel: 'Adicionar Treino'
        };
      case 'calendar':
        return {
          icon: <Calendar size={48} className="text-gray-400" />,
          title: 'Nenhum treino nesta data',
          description: 'Não há treinos agendados para esta data.',
          actionLabel: 'Adicionar Treino'
        };
      default:
        return {
          icon: <Dumbbell size={48} className="text-gray-400" />,
          title: 'Nenhum dado encontrado',
          description: 'Não há informações disponíveis no momento.',
          actionLabel: 'Atualizar'
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">
        {content.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {content.title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm">
        {content.description}
      </p>
      {onAction && (
        <Button 
          onClick={onAction}
          className="workout-gradient text-white"
        >
          <PlusCircle size={16} className="mr-2" />
          {content.actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
