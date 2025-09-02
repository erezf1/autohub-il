import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import AppTabBar from "./AppTabBar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AppHeader />
      <main className="pb-16 pt-4 min-h-[calc(100vh-8rem)]">
        <div className="container max-w-md mx-auto px-4">
          {children}
        </div>
      </main>
      <AppTabBar />
    </div>
  );
};

export default AppLayout;