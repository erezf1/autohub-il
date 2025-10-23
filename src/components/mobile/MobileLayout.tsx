import { ReactNode } from "react";
import MobileHeader from "./MobileHeader";
import MobileTabBar from "./MobileTabBar";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div 
      className="h-screen w-screen flex flex-col fixed inset-0 bg-black overflow-hidden" 
      style={{
        overscrollBehavior: 'none',
        touchAction: 'none'
      }}
      dir="rtl"
    >
      {/* Desktop Background - Fixed */}
      <div 
        className="hidden md:block fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(/DeskBG.svg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />
      
      {/* Mobile Background - Fixed */}
      <div 
        className="block md:hidden fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(/BG.svg)`,
          backgroundSize: '100vw auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />
      
      {/* Fixed Header */}
      <div className="flex-shrink-0 relative z-50" style={{ touchAction: 'none' }}>
        <MobileHeader />
      </div>
      
      {/* Scrollable Content Area - ONLY this scrolls */}
      <main 
        className="flex-1 overflow-y-auto overflow-x-hidden relative" 
        style={{ 
          zIndex: 1,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y'
        }}
      >
        <div className="container max-w-md mx-auto px-4 py-4">
          {children}
          {/* Bottom Spacer - Height of footer + 20px breathing room */}
          <div style={{ height: 'calc(4rem + 50px)' }} aria-hidden="true" />
        </div>
      </main>
      
      {/* Fixed Tab Bar */}
      <div className="flex-shrink-0 relative z-50" style={{ touchAction: 'none' }}>
        <MobileTabBar />
      </div>
    </div>
  );
};

export default MobileLayout;