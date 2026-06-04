import { useWorkspaceStore } from '@/store/workspaceStore';
import WorkspaceSidebar from '@/components/WorkspaceSidebar';
import CommandCenter from '@/components/CommandCenter';
import BrowserView from '@/components/BrowserView';
import TaskLogger from '@/components/TaskLogger';
import SocialSharingManager from '@/components/SocialSharingManager';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-dark to-navy-light flex flex-col md:flex-row"
    >
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0 border-r border-cyan/20 bg-gradient-to-b from-navy-dark/80 to-navy-light/80 backdrop-blur-sm overflow-y-auto">
        <WorkspaceSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-dark/50 to-navy-light/50 backdrop-blur-md border-b border-cyan/20 px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-cyan uppercase tracking-wider">
                Workspace {activeWorkspace + 1}
              </h1>
              <p className="text-xs md:text-sm text-foreground/60 mt-1">
                Multi-Session Task Management & Workflow Dashboard
              </p>
            </div>
            <div className="flex items-center gap-4 md:justify-end">
              <div className="text-right">
                <p className="text-xs text-foreground/50 uppercase tracking-widest">Status</p>
                <p className="text-sm font-semibold text-cyan">Ready</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-cyan animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Grid - Fully Responsive Layout */}
        <div className="flex-1 overflow-auto p-3 md:p-6 space-y-4 md:space-y-6">
          {/* Top Section: Command Center and Social Sharing Manager */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
            {/* Command Center - Full width on mobile, 2/3 on desktop */}
            <div className="md:col-span-2 w-full">
              <CommandCenter workspaceId={activeWorkspace} />
            </div>

            {/* Social Sharing Manager - Full width on mobile, 1/3 on desktop */}
            <div className="md:col-span-1 w-full">
              <div className="h-full min-h-[400px] md:max-h-[600px]">
                <SocialSharingManager workspaceId={activeWorkspace} />
              </div>
            </div>
          </div>

          {/* Middle Section: Browser View - Responsive height */}
          <div className="w-full min-h-[300px] md:h-96">
            <BrowserView workspaceId={activeWorkspace} />
          </div>

          {/* Bottom Section: Task Logger - Responsive height */}
          <div className="w-full min-h-[250px] md:h-64">
            <TaskLogger workspaceId={activeWorkspace} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
