import { useWorkspaceStore } from '@/store/workspaceStore';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface WorkspaceSidebarProps {
  onWorkspaceChange?: (id: number) => void;
}

const workspaceNames = [
  'Alpha',
  'Beta',
  'Gamma',
  'Delta',
  'Epsilon',
];

export default function WorkspaceSidebar({ onWorkspaceChange }: WorkspaceSidebarProps) {
  const { activeWorkspace, setActiveWorkspace, workspaces } = useWorkspaceStore();

  const handleWorkspaceClick = (id: number) => {
    setActiveWorkspace(id);
    onWorkspaceChange?.(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col p-4 border-r border-cyan/20 rounded-lg border transition-all duration-200"
      style={{
        backgroundColor: 'rgba(20, 25, 45, 0.7)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0, 217, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Logo/Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-cyan" />
          <h1 className="text-lg font-bold text-cyan uppercase tracking-wider">
            Workflow
          </h1>
        </div>
        <p className="text-xs text-foreground/50 uppercase tracking-widest">Dashboard</p>
      </div>

      {/* Workspace Navigation */}
      <div className="space-y-2 flex-1">
        <p className="text-xs font-bold text-foreground/60 uppercase px-2 mb-3">
          Workspaces
        </p>

        {workspaceNames.map((name, id) => {
          const workspace = workspaces[id];
          const hasLogs = workspace.logs.length > 0;
          const hasTasks = workspace.socialTasks.length > 0;
          const isActive = activeWorkspace === id;

          return (
            <motion.button
              key={id}
              onClick={() => handleWorkspaceClick(id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left px-3 py-2 rounded transition-all duration-200 ${
                isActive
                  ? 'bg-cyan/20 border border-cyan/50 shadow-lg shadow-cyan/10'
                  : 'border border-cyan/10 hover:border-cyan/30 hover:bg-cyan/10'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold uppercase tracking-wide ${
                    isActive ? 'text-cyan' : 'text-foreground/70'
                  }`}>
                    {name}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {hasLogs ? `${workspace.logs.length} logs` : 'No activity'}
                  </p>
                </div>
                {hasTasks && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-navy-dark bg-orange rounded-full">
                      {workspace.socialTasks.length}
                    </span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-cyan/20 space-y-2">
        <div className="bg-navy-light/50 rounded p-2 text-xs">
          <p className="text-foreground/60">
            <span className="text-cyan font-semibold">Active:</span> {workspaceNames[activeWorkspace]}
          </p>
        </div>
        <p className="text-xs text-foreground/50 text-center">
          All data persists automatically
        </p>
      </div>
    </motion.div>
  );
}
