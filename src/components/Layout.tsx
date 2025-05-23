
import React from 'react';
import BottomNav from './BottomNav';
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "Good evening";
  } else {
    return "Good night";
  }
};

const getUserFirstName = (email: string) => {
  // Extract first name from email (before @ symbol)
  const username = email.split('@')[0];
  // Capitalize first letter
  return username.charAt(0).toUpperCase() + username.slice(1);
};

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {user && (
        <header className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800">
                {getTimeBasedGreeting()}, {getUserFirstName(user.email || '')}!
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </header>
      )}
      <main className="flex-grow container mx-auto px-4 pb-20">
        {children}
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
};

export default Layout;
