
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { getWorkoutsByDate } from '@/utils/workoutData';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

const Calendar = ({ onDateSelect }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = 
        today.getDate() === day && 
        today.getMonth() === currentMonth.getMonth() && 
        today.getFullYear() === currentMonth.getFullYear();
      
      const isSelected = 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();
      
      const workouts = getWorkoutsByDate(date);
      const hasWorkout = workouts.length > 0;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm
            ${isToday ? 'font-bold' : ''}
            ${isSelected ? 'bg-workout-primary text-white' : 'hover:bg-workout-light'}
            ${hasWorkout && !isSelected ? 'border-2 border-workout-primary' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <CalendarIcon size={20} className="text-workout-primary mr-2" />
          <h3 className="font-semibold text-lg">Calendar</h3>
        </div>
        <div className="flex space-x-2">
          <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100">
            &lt;
          </button>
          <span className="font-medium">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
            &gt;
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-xs text-center font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
