export const WORKSPACE_NAMES = [
  'Alpha',
  'Beta',
  'Gamma',
  'Delta',
  'Epsilon',
];

export const getWorkspaceName = (id: number) => WORKSPACE_NAMES[id] || `Workspace ${id + 1}`;
