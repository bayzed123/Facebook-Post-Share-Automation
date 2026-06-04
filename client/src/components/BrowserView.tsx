import { useEffect, useRef } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';

interface BrowserViewProps {
  workspaceId: number;
}

export default function BrowserView({ workspaceId }: BrowserViewProps) {
  const workspace = useWorkspaceStore((state) => state.getWorkspaceState(workspaceId));
  const { setIsLoading } = useWorkspaceStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (workspace.iframeUrl) {
      setIsLoading(workspaceId, true);
      const timer = setTimeout(() => {
        setIsLoading(workspaceId, false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [workspace.iframeUrl, workspaceId, setIsLoading]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="p-4 flex flex-col h-full rounded-lg border transition-all duration-200"
      style={{
        backgroundColor: 'rgba(20, 25, 45, 0.7)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0, 217, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Browser Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-cyan/20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-orange/60"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
        </div>
        <div className="flex-1 bg-input border border-cyan/30 rounded px-3 py-1.5 text-xs text-foreground/60 truncate">
          {workspace.iframeUrl || 'No URL loaded'}
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative mt-4 bg-black/30 rounded border border-cyan/10 overflow-hidden">
        {!workspace.iframeUrl ? (
          <div className="w-full h-full flex items-center justify-center text-foreground/40">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No URL loaded. Enter a URL and click Execute to load a website.</p>
            </div>
          </div>
        ) : !isValidUrl(workspace.iframeUrl) ? (
          <div className="w-full h-full flex items-center justify-center text-foreground/40">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-orange/60" />
              <p className="text-sm">Invalid URL. Please enter a valid website URL.</p>
            </div>
          </div>
        ) : (
          <>
            {workspace.isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan mx-auto mb-2" />
                  <p className="text-sm text-foreground/60">Loading...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={workspace.iframeUrl}
              title="Browser View"
              className="w-full h-full border-none"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
            />
          </>
        )}
      </div>

      {/* Browser Footer */}
      <div className="flex items-center justify-between pt-3 text-xs text-foreground/50 border-t border-cyan/20">
        <span>Ready</span>
        <span className="text-cyan/60">Interactive Mode</span>
      </div>
    </motion.div>
  );
}
