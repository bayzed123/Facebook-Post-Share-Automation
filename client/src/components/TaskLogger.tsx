import { useEffect, useRef } from 'react';
import { useWorkspaceStore, TaskStatus } from '@/store/workspaceStore';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Circle } from 'lucide-react';

interface TaskLoggerProps {
  workspaceId: number;
}

const statusColors: Record<TaskStatus, string> = {
  pending: 'text-slate-400',
  running: 'text-cyan',
  'action-required': 'text-orange',
  paused: 'text-purple',
  success: 'text-green-400',
  failed: 'text-red-400',
};

const statusBgColors: Record<TaskStatus, string> = {
  pending: 'bg-slate-500/10',
  running: 'bg-cyan/10',
  'action-required': 'bg-orange/10',
  paused: 'bg-purple/10',
  success: 'bg-green-500/10',
  failed: 'bg-red-500/10',
};

export default function TaskLogger({ workspaceId }: TaskLoggerProps) {
  const workspace = useWorkspaceStore((state) => state.getWorkspaceState(workspaceId));
  const { clearLogs, setLogFilter } = useWorkspaceStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [workspace.logs]);

  const filteredLogs = workspace.logFilter === 'all'
    ? workspace.logs
    : workspace.logs.filter((log) => log.status === workspace.logFilter);

  const statusOptions: (TaskStatus | 'all')[] = [
    'all',
    'pending',
    'running',
    'action-required',
    'paused',
    'success',
    'failed',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="p-4 flex flex-col h-full rounded-lg border transition-all duration-200"
      style={{
        backgroundColor: 'rgba(20, 25, 45, 0.7)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0, 217, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan/20">
        <h3 className="text-lg font-bold text-cyan uppercase tracking-wider">
          Activity Log
        </h3>
        <Button
          onClick={() => clearLogs(workspaceId)}
          variant="ghost"
          size="sm"
          className="text-orange/70 hover:text-orange hover:bg-orange/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {statusOptions.map((status) => (
          <Button
            key={status}
            onClick={() => setLogFilter(workspaceId, status)}
            variant={workspace.logFilter === status ? 'default' : 'outline'}
            size="sm"
            className={`whitespace-nowrap text-xs font-medium transition-all ${
              workspace.logFilter === status
                ? 'bg-cyan text-navy-dark'
                : 'border-cyan/30 text-foreground/60 hover:border-cyan/50 hover:text-foreground'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('-', ' ').charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </Button>
        ))}
      </div>

      {/* Logs Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 bg-black/20 rounded p-3 border border-cyan/10"
      >
        <AnimatePresence>
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-foreground/40 text-sm">
              No logs to display
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 p-2 rounded text-xs font-mono ${statusBgColors[log.status]} border border-cyan/10`}
              >
                <div className="flex items-start gap-2 flex-1">
                  <Circle className={`w-2 h-2 mt-1 flex-shrink-0 ${statusColors[log.status]}`} fill="currentColor" />
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground/60">
                      {(() => {
                        try {
                          const date = typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp;
                          return date instanceof Date && !isNaN(date.getTime()) 
                            ? date.toLocaleTimeString() 
                            : 'Invalid Date';
                        } catch (e) {
                          return 'Error';
                        }
                      })()}
                    </div>
                    <div className={`${statusColors[log.status]} break-words`}>
                      {log.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 text-xs text-foreground/50 border-t border-cyan/20">
        <span>{filteredLogs.length} entries</span>
        <span className="text-cyan/60">Auto-scroll enabled</span>
      </div>
    </motion.div>
  );
}
