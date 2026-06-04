import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'pending' | 'running' | 'action-required' | 'paused' | 'success' | 'failed';

export interface TaskLog {
  id: string;
  timestamp: Date;
  message: string;
  status: TaskStatus;
}

export interface SocialSharingTask {
  id: string;
  contentUrl: string;
  targetUrls: string[];
  distributionCount: number;
  completed: number;
  pending: number;
  remaining: number;
  status: TaskStatus;
  createdAt: Date;
}

export interface WorkspaceState {
  // Command Center
  targetUrl: string;
  contentInput: string;
  taskConfig: Record<string, string>;
  
  // Browser View
  iframeUrl: string;
  isLoading: boolean;
  
  // Task Logging
  logs: TaskLog[];
  
  // Social Sharing
  socialTasks: SocialSharingTask[];
  
  // UI State
  logFilter: TaskStatus | 'all';
}

export interface WorkspaceStore {
  // Workspace management
  activeWorkspace: number;
  setActiveWorkspace: (id: number) => void;
  
  // Workspace state
  workspaces: Record<number, WorkspaceState>;
  
  // Command Center actions
  setTargetUrl: (workspaceId: number, url: string) => void;
  setContentInput: (workspaceId: number, content: string) => void;
  setTaskConfig: (workspaceId: number, config: Record<string, string>) => void;
  resetCommandCenter: (workspaceId: number) => void;
  
  // Browser View actions
  setIframeUrl: (workspaceId: number, url: string) => void;
  setIsLoading: (workspaceId: number, loading: boolean) => void;
  
  // Task Logging actions
  addLog: (workspaceId: number, message: string, status: TaskStatus) => void;
  clearLogs: (workspaceId: number) => void;
  setLogFilter: (workspaceId: number, filter: TaskStatus | 'all') => void;
  
  // Social Sharing actions
  addSocialTask: (workspaceId: number, task: Omit<SocialSharingTask, 'id' | 'createdAt'>) => void;
  updateSocialTask: (workspaceId: number, taskId: string, updates: Partial<SocialSharingTask>) => void;
  removeSocialTask: (workspaceId: number, taskId: string) => void;
  
  // Utility
  getWorkspaceState: (workspaceId: number) => WorkspaceState;
}

const initialWorkspaceState: WorkspaceState = {
  targetUrl: '',
  contentInput: '',
  taskConfig: {},
  iframeUrl: '',
  isLoading: false,
  logs: [],
  socialTasks: [],
  logFilter: 'all',
};

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      activeWorkspace: 0,
      workspaces: {
        0: { ...initialWorkspaceState },
        1: { ...initialWorkspaceState },
        2: { ...initialWorkspaceState },
        3: { ...initialWorkspaceState },
        4: { ...initialWorkspaceState },
      },
      
      setActiveWorkspace: (id: number) => {
        set({ activeWorkspace: id });
      },
      
      setTargetUrl: (workspaceId: number, url: string) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              targetUrl: url,
            },
          },
        }));
      },
      
      setContentInput: (workspaceId: number, content: string) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              contentInput: content,
            },
          },
        }));
      },
      
      setTaskConfig: (workspaceId: number, config: Record<string, string>) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              taskConfig: config,
            },
          },
        }));
      },
      
      resetCommandCenter: (workspaceId: number) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              targetUrl: '',
              contentInput: '',
              taskConfig: {},
            },
          },
        }));
      },
      
      setIframeUrl: (workspaceId: number, url: string) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              iframeUrl: url,
            },
          },
        }));
      },
      
      setIsLoading: (workspaceId: number, loading: boolean) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              isLoading: loading,
            },
          },
        }));
      },
      
      addLog: (workspaceId: number, message: string, status: TaskStatus) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              logs: [
                ...state.workspaces[workspaceId].logs,
                {
                  id: `log-${Date.now()}-${Math.random()}`,
                  timestamp: new Date(),
                  message,
                  status,
                },
              ],
            },
          },
        }));
      },
      
      clearLogs: (workspaceId: number) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              logs: [],
            },
          },
        }));
      },
      
      setLogFilter: (workspaceId: number, filter: TaskStatus | 'all') => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              logFilter: filter,
            },
          },
        }));
      },
      
      addSocialTask: (workspaceId: number, task: Omit<SocialSharingTask, 'id' | 'createdAt'>) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              socialTasks: [
                ...state.workspaces[workspaceId].socialTasks,
                {
                  ...task,
                  id: `task-${Date.now()}-${Math.random()}`,
                  createdAt: new Date(),
                },
              ],
            },
          },
        }));
      },
      
      updateSocialTask: (workspaceId: number, taskId: string, updates: Partial<SocialSharingTask>) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              socialTasks: state.workspaces[workspaceId].socialTasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            },
          },
        }));
      },
      
      removeSocialTask: (workspaceId: number, taskId: string) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              socialTasks: state.workspaces[workspaceId].socialTasks.filter((task) => task.id !== taskId),
            },
          },
        }));
      },
      
      getWorkspaceState: (workspaceId: number) => {
        return get().workspaces[workspaceId] || initialWorkspaceState;
      },
    }),
    {
      name: 'workflow-dashboard-store',
    }
  )
);
