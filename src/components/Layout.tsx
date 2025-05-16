
import React from 'react';
import BottomNav from './BottomNav';
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {user && (
        <header className="bg-white border-b border-gray-200 py-2 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <h2 className="text-sm font-medium">
              {user.email}
            </h2>
            <Button variant="outline" size="sm" onClick={signOut}>
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
