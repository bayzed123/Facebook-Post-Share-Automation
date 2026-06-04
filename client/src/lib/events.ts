export const CUSTOM_EVENTS = {
  START_AUTOMATION_TASK: 'START_AUTOMATION_TASK',
} as const;

export interface AutomationTaskPayload {
  workspaceId: number;
  workspaceName: string;
  targetUrl: string;
  contentInput?: string;
  taskConfig: Record<string, string>;
  timestamp: string;
  type: 'manual' | 'social-workflow';
  taskId?: string;
}

export const dispatchAutomationEvent = (payload: AutomationTaskPayload) => {
  const event = new CustomEvent(CUSTOM_EVENTS.START_AUTOMATION_TASK, {
    detail: payload,
    bubbles: true,
    composed: true,
  });
  window.dispatchEvent(event);
  console.log(`[Automation] Dispatched ${CUSTOM_EVENTS.START_AUTOMATION_TASK}`, payload);
};
