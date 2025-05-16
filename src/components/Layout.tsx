
import React from 'react';
import BottomNav from './BottomNav';
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 pb-20">
        {children}
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
};

export default Layout;
