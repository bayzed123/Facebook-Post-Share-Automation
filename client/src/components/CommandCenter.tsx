import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { dispatchAutomationEvent } from '@/lib/events';
import { getWorkspaceName } from '@/lib/workspace';

interface CommandCenterProps {
  workspaceId: number;
}

export default function CommandCenter({ workspaceId }: CommandCenterProps) {
  const workspace = useWorkspaceStore((state) => state.getWorkspaceState(workspaceId));
  const {
    setTargetUrl,
    setContentInput,
    setTaskConfig,
    resetCommandCenter,
    addLog,
  } = useWorkspaceStore();

  const [configKey, setConfigKey] = useState('');
  const [configValue, setConfigValue] = useState('');

  const handleAddConfig = () => {
    if (configKey && configValue) {
      const newConfig = {
        ...workspace.taskConfig,
        [configKey]: configValue,
      };
      setTaskConfig(workspaceId, newConfig);
      setConfigKey('');
      setConfigValue('');
    }
  };

  const handleExecute = () => {
    if (!workspace.targetUrl) {
      addLog(workspaceId, 'Error: Target URL is required', 'failed');
      toast.error('Target URL is required');
      return;
    }

    const workspaceName = getWorkspaceName(workspaceId);
    
    // Dispatch custom event for the browser extension
    dispatchAutomationEvent({
      workspaceId,
      workspaceName,
      targetUrl: workspace.targetUrl,
      contentInput: workspace.contentInput,
      taskConfig: workspace.taskConfig,
      timestamp: new Date().toISOString(),
      type: 'manual'
    });

    addLog(workspaceId, `Command sent to browser extension: ${workspace.targetUrl}`, 'running');
    toast.success('Command sent to browser extension', {
      description: `Target: ${workspace.targetUrl}`,
    });
    
    // We no longer set iframe URL as per requirements
    // Instead, we simulate the extension starting the work
    setTimeout(() => {
      addLog(workspaceId, 'Automation signal received by extension bridge', 'success');
    }, 1000);
  };

  const handleReset = () => {
    resetCommandCenter(workspaceId);
    addLog(workspaceId, 'Command center reset', 'pending');
    toast.info('Command center reset');
  };

  const handleRemoveConfig = (key: string) => {
    const newConfig = { ...workspace.taskConfig };
    delete newConfig[key];
    setTaskConfig(workspaceId, newConfig);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6 rounded-lg border transition-all duration-200"
      style={{
        backgroundColor: 'rgba(20, 25, 45, 0.7)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0, 217, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div>
        <h2 className="text-xl font-bold text-cyan mb-4 uppercase tracking-wider">
          Manual Command Center
        </h2>

        {/* Target URL Input */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-foreground/80">
            Target URL
          </label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={workspace.targetUrl}
            onChange={(e) => setTargetUrl(workspaceId, e.target.value)}
            className="bg-input border-cyan/30 text-foreground placeholder:text-foreground/40"
          />
        </div>

        {/* Content Input */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-foreground/80">
            Content / Notes
          </label>
          <Textarea
            placeholder="Enter content or notes for this task..."
            value={workspace.contentInput}
            onChange={(e) => setContentInput(workspaceId, e.target.value)}
            rows={4}
            className="bg-input border-cyan/30 text-foreground placeholder:text-foreground/40 resize-none"
          />
        </div>

        {/* Task Configuration */}
        <div className="space-y-3 mb-4">
          <label className="block text-sm font-medium text-foreground/80">
            Task Configuration
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Key"
              value={configKey}
              onChange={(e) => setConfigKey(e.target.value)}
              className="bg-input border-cyan/30 text-foreground placeholder:text-foreground/40 flex-1"
            />
            <Input
              placeholder="Value"
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
              className="bg-input border-cyan/30 text-foreground placeholder:text-foreground/40 flex-1"
            />
            <Button
              onClick={handleAddConfig}
              variant="outline"
              className="border-cyan/50 text-cyan hover:bg-cyan/10"
            >
              Add
            </Button>
          </div>

          {/* Config Items */}
          {Object.entries(workspace.taskConfig).length > 0 && (
            <div className="space-y-2 mt-3">
              {Object.entries(workspace.taskConfig).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-navy-light/50 p-2 rounded border border-cyan/20"
                >
                  <span className="text-sm">
                    <span className="text-cyan font-medium">{key}</span>
                    <span className="text-foreground/60">: {value}</span>
                  </span>
                  <button
                    onClick={() => handleRemoveConfig(key)}
                    className="text-orange hover:text-orange/80 transition-colors text-xs font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleExecute}
            className="flex-1 bg-cyan text-navy-dark hover:bg-cyan/90 font-semibold uppercase tracking-wide"
          >
            <Play className="w-4 h-4 mr-2" />
            Execute
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-orange/50 text-orange hover:bg-orange/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
