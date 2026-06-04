import { useWorkspaceStore } from '@/store/workspaceStore';
import { motion } from 'framer-motion';
import { Globe, ShieldAlert, Zap } from 'lucide-react';

interface BrowserViewProps {
  workspaceId: number;
}

export default function BrowserView({ workspaceId }: BrowserViewProps) {
  const workspace = useWorkspaceStore((state) => state.getWorkspaceState(workspaceId));

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="h-full flex flex-col rounded-lg border border-cyan/20 overflow-hidden bg-navy-dark/50 backdrop-blur-md">
      {/* Browser Header */}
      <div className="bg-navy-light/80 border-b border-cyan/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="bg-black/40 border border-cyan/10 rounded px-3 py-1 flex-1 max-w-2xl flex items-center gap-2">
            <Globe className="w-3 h-3 text-cyan/50" />
            <span className="text-xs text-foreground/40 truncate">
              {workspace.targetUrl || 'Extension Bridge Ready'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-cyan/10 border border-cyan/20">
            <Zap className="w-3 h-3 text-cyan" />
            <span className="text-[10px] font-bold text-cyan uppercase tracking-tighter">Bridge Active</span>
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-black/20">
        {!workspace.targetUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan/5 flex items-center justify-center mb-4 border border-cyan/10">
              <Zap className="w-8 h-8 text-cyan/20" />
            </div>
            <h3 className="text-lg font-semibold text-cyan/80 mb-2 uppercase tracking-wider">Extension Bridge</h3>
            <p className="text-sm text-foreground/40 max-w-md">
              No URL loaded. Enter a URL and click Execute to send a command to your browser extension.
            </p>
          </div>
        ) : !isValidUrl(workspace.targetUrl) ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <ShieldAlert className="w-12 h-12 text-orange/50 mb-4" />
            <h3 className="text-lg font-semibold text-orange/80 mb-2 uppercase tracking-wider">Invalid Target</h3>
            <p className="text-sm text-foreground/40 max-w-md">
              The provided URL "{workspace.targetUrl}" is not valid. Please check the Manual Command Center.
            </p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-navy-dark border-2 border-cyan/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,217,255,0.3)]">
                  <Globe className="w-10 h-10 text-cyan animate-spin-slow" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-cyan uppercase tracking-widest">Automation Active</h3>
                <p className="text-sm text-foreground/60 mt-2">
                  Command sent for: <span className="text-cyan font-mono">{new URL(workspace.targetUrl).hostname}</span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {Object.entries(workspace.taskConfig).map(([key, value]) => (
                  <div key={key} className="px-2 py-1 rounded bg-cyan/5 border border-cyan/10 text-[10px] text-cyan/70 uppercase">
                    {key}: {value}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-foreground/30 uppercase tracking-widest mt-8">
                The browser extension is now handling this task in a separate window.
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Browser Footer */}
      <div className="bg-navy-light/50 border-t border-cyan/10 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan animate-pulse"></div>
          <span className="text-[10px] text-cyan/70 uppercase font-bold tracking-wider">Extension Bridge Status: Active</span>
        </div>
        <div className="text-[10px] text-foreground/30 uppercase tracking-widest">
          Secure Cross-Origin Communication Enabled
        </div>
      </div>
    </div>
  );
}
