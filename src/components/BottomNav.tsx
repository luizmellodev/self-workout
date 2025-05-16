
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Home, Settings, Calendar as CalendarIcon } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <NavLink to="/" className={({ isActive }) => 
            `flex flex-col items-center p-2 ${isActive ? 'text-workout-primary' : 'text-gray-500'}`
          } end>
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          <NavLink to="/workouts" className={({ isActive }) => 
            `flex flex-col items-center p-2 ${isActive ? 'text-workout-primary' : 'text-gray-500'}`
          }>
            <CalendarIcon size={24} />
            <span className="text-xs mt-1">Workouts</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => 
            `flex flex-col items-center p-2 ${isActive ? 'text-workout-primary' : 'text-gray-500'}`
          }>
            <Settings size={24} />
            <span className="text-xs mt-1">Settings</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
