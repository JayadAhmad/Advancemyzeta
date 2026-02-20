import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AppSidebar } from './AppSidebar';
import { GlobalTopBar } from './GlobalTopBar';
// import { AICopilotPanel } from '@/Components/copilot/AICopilotPanel';
import AiChatPanel from '../AIChat/AiChatPanel';
import { cn } from '@/lib/utils';

 const DashboardLayout = () => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  return (
    <div className="flex flex-row h-screen bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <GlobalTopBar
          onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          isCopilotOpen={isCopilotOpen}
        />

        <main
          className={cn(
            'flex-1 overflow-y-auto transition-all duration-300',
            // isCopilotOpen && 'mr-96'
          )}
        >
          <Outlet />
        </main>
      </div>

      <AiChatPanel
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
}

export default DashboardLayout;