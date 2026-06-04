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
      className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-dark to-navy-light flex"
    >
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-cyan/20 bg-gradient-to-b from-navy-dark/80 to-navy-light/80 backdrop-blur-sm">
        <WorkspaceSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-dark/50 to-navy-light/50 backdrop-blur-md border-b border-cyan/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-cyan uppercase tracking-wider">
                Workspace {activeWorkspace + 1}
              </h1>
              <p className="text-sm text-foreground/60 mt-1">
                Multi-Session Task Management & Workflow Dashboard
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-foreground/50 uppercase tracking-widest">Status</p>
                <p className="text-sm font-semibold text-cyan">Ready</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-cyan animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Top Section: Command Center */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CommandCenter workspaceId={activeWorkspace} />
            </div>

            {/* Right Sidebar: Social Sharing Manager */}
            <div className="lg:col-span-1">
              <div className="h-full max-h-[600px]">
                <SocialSharingManager workspaceId={activeWorkspace} />
              </div>
            </div>
          </div>

          {/* Middle Section: Browser View */}
          <div className="h-96">
            <BrowserView workspaceId={activeWorkspace} />
          </div>

          {/* Bottom Section: Task Logger */}
          <div className="h-64">
            <TaskLogger workspaceId={activeWorkspace} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}