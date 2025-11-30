import React from 'react';
import { Outlet } from 'react-router-dom';
import { PrivateHeader } from './PrivateHeader';

/**
 * Layout for Private User pages
 * Simple layout with header only (no tab bar like dealers)
 */
export const PrivateLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <PrivateHeader />
      <main className="pb-4">
        <Outlet />
      </main>
    </div>
  );
};
