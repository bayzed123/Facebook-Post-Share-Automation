import { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Play, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { dispatchAutomationEvent } from '@/lib/events';
import { getWorkspaceName } from '@/lib/workspace';

interface SocialSharingManagerProps {
  workspaceId: number;
}

export default function SocialSharingManager({ workspaceId }: SocialSharingManagerProps) {
  const workspace = useWorkspaceStore((state) => state.getWorkspaceState(workspaceId));
  const { addSocialTask, removeSocialTask, updateSocialTask, addLog } = useWorkspaceStore();

  const [contentUrl, setContentUrl] = useState('');
  const [targetUrls, setTargetUrls] = useState('');
  const [distributionCount, setDistributionCount] = useState('');

  const handleAddTask = () => {
    if (!contentUrl || !targetUrls || !distributionCount) {
      addLog(workspaceId, 'Error: All fields are required', 'failed');
      toast.error('All fields are required');
      return;
    }

    const urls = targetUrls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url);

    if (urls.length === 0) {
      addLog(workspaceId, 'Error: At least one target URL is required', 'failed');
      toast.error('At least one target URL is required');
      return;
    }

    const count = parseInt(distributionCount, 10);
    if (isNaN(count) || count <= 0) {
      addLog(workspaceId, 'Error: Distribution count must be a positive number', 'failed');
      toast.error('Distribution count must be a positive number');
      return;
    }

    addSocialTask(workspaceId, {
      contentUrl,
      targetUrls: urls,
      distributionCount: count,
      completed: 0,
      pending: urls.length,
      remaining: urls.length,
      status: 'pending',
    });

    addLog(workspaceId, `Social task created: ${urls.length} targets, ${count} distributions`, 'success');
    toast.success('Social task created');

    // Reset form
    setContentUrl('');
    setTargetUrls('');
    setDistributionCount('');
  };

  const handleExecuteTask = (taskId: string) => {
    const task = workspace.socialTasks.find((t) => t.id === taskId);
    if (task) {
      const workspaceName = getWorkspaceName(workspaceId);
      
      updateSocialTask(workspaceId, taskId, { status: 'running' });
      addLog(workspaceId, `Executing social task: ${task.contentUrl}`, 'running');
      
      // Dispatch custom event for the browser extension
      dispatchAutomationEvent({
        workspaceId,
        workspaceName,
        targetUrl: task.contentUrl,
        contentInput: `Workflow Task: ${taskId}\nTargets: ${task.targetUrls.join(', ')}`,
        taskConfig: {
          distributionCount: task.distributionCount.toString(),
          targetUrls: JSON.stringify(task.targetUrls),
        },
        timestamp: new Date().toISOString(),
        type: 'social-workflow',
        taskId: taskId
      });

      toast.success('Task command sent to extension', {
        description: `URL: ${task.contentUrl}`,
      });

      // Simulate execution bridge
      setTimeout(() => {
        updateSocialTask(workspaceId, taskId, {
          status: 'action-required',
          pending: Math.max(0, task.pending - 1),
          remaining: Math.max(0, task.remaining - 1),
        });
        addLog(workspaceId, `Extension processed task ${taskId.slice(0, 8)}. Waiting for bridge approval.`, 'action-required');
      }, 1500);
    }
  };

  const handleApproveTask = (taskId: string) => {
    const task = workspace.socialTasks.find((t) => t.id === taskId);
    if (task) {
      const newCompleted = task.completed + 1;
      const isComplete = newCompleted >= task.targetUrls.length;

      updateSocialTask(workspaceId, taskId, {
        status: isComplete ? 'success' : 'pending',
        completed: newCompleted,
        pending: Math.max(0, task.pending - 1),
        remaining: Math.max(0, task.remaining - 1),
      });

      addLog(
        workspaceId,
        isComplete
          ? `Social task completed: ${newCompleted}/${task.targetUrls.length} targets`
          : `Approval granted. Continuing distribution...`,
        'success'
      );
      toast.success('Task approved');
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total === 0 ? 0 : (completed / total) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="p-4 flex flex-col h-full space-y-4 rounded-lg border transition-all duration-200"
      style={{
        backgroundColor: 'rgba(20, 25, 45, 0.7)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0, 217, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-cyan uppercase tracking-wider mb-4">
          Social Sharing Workflow
        </h3>

        {/* Input Form */}
        <div className="space-y-3 pb-4 border-b border-cyan/20">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-foreground/70 uppercase">
              Content URL
            </label>
            <Input
              type="url"
              placeholder="https://example.com/post"
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              className="bg-input border-cyan/30 text-foreground placeholder:text-foreground/40 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-foreground/70 uppercase">
              Target URLs (one per line)
            </label>
            <div className="relative">
              <Textarea
                placeholder="https://group1.com&#10;https://group2.com&#10;https://group3.com"
                value={targetUrls}
                onChange={(e) => setTargetUrls(e.target.value)}
                rows={3}
                className="bg-input border-cyan/30 text-foreground placeholder:text-foreground/40 text-sm resize-none max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan/30 scrollbar-track-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-foreground/70 uppercase">
              Distribution Count
            </label>
            <Input
              type="number"
              placeholder="5"
              value={distributionCount}
              onChange={(e) => setDistributionCount(e.target.value)}
              className="bg-input border-cyan/30 text-foreground placeholder:text-foreground/40 text-sm"
              min="1"
            />
          </div>

          <Button
            onClick={handleAddTask}
            className="w-full bg-orange text-navy-dark hover:bg-orange/90 font-semibold uppercase tracking-wide text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Task Queue */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <h4 className="text-xs font-bold text-foreground/60 uppercase">Active Tasks</h4>

        <AnimatePresence>
          {workspace.socialTasks.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-foreground/40 text-xs">
              No active tasks
            </div>
          ) : (
            workspace.socialTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-navy-light/50 border border-cyan/20 rounded p-3 space-y-2"
              >
                {/* Task Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground/60 truncate">{task.contentUrl}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium status-${task.status}`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeSocialTask(workspaceId, task.id)}
                    variant="ghost"
                    size="sm"
                    className="text-orange/60 hover:text-orange hover:bg-orange/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-black/30 rounded p-1.5 text-center">
                    <div className="text-cyan font-bold">{task.targetUrls.length}</div>
                    <div className="text-foreground/50 text-xs">Total</div>
                  </div>
                  <div className="bg-black/30 rounded p-1.5 text-center">
                    <div className="text-green-400 font-bold">{task.completed}</div>
                    <div className="text-foreground/50 text-xs">Done</div>
                  </div>
                  <div className="bg-black/30 rounded p-1.5 text-center">
                    <div className="text-orange font-bold">{task.pending}</div>
                    <div className="text-foreground/50 text-xs">Pending</div>
                  </div>
                  <div className="bg-black/30 rounded p-1.5 text-center">
                    <div className="text-purple font-bold">{task.remaining}</div>
                    <div className="text-foreground/50 text-xs">Remaining</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <Progress
                    value={getProgressPercentage(task.completed, task.targetUrls.length)}
                    className="h-1 bg-black/30"
                  />
                  <p className="text-xs text-foreground/50">
                    {task.completed} of {task.targetUrls.length} completed
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {task.status === 'pending' && (
                    <Button
                      onClick={() => handleExecuteTask(task.id)}
                      size="sm"
                      className="flex-1 bg-cyan text-navy-dark hover:bg-cyan/90 text-xs font-semibold"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Execute
                    </Button>
                  )}
                  {task.status === 'action-required' && (
                    <Button
                      onClick={() => handleApproveTask(task.id)}
                      size="sm"
                      className="flex-1 bg-green-500 text-navy-dark hover:bg-green-600 text-xs font-semibold"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
