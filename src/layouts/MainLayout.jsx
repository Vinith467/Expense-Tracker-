import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BottomNavigation from '../components/BottomNavigation';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-background text-slate-200 overflow-hidden relative selection:bg-primary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Topbar />
        
        {/* Main scrollable area. Added padding bottom on mobile to clear the bottom nav */}
        <main className="flex-1 overflow-auto p-4 pb-24 md:pb-6 md:p-8 relative z-0">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
