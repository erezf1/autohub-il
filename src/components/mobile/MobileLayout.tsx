import { ReactNode } from "react";
import MobileHeader from "./MobileHeader";
import MobileTabBar from "./MobileTabBar";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen" dir="rtl">
      <MobileHeader />
      <main className="pb-16 pt-4 min-h-[calc(100vh-8rem)]">
        <div className="container max-w-md mx-auto px-4">
          {children}
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
};

export default MobileLayout;