export type GetActivityFlowActions = {
  activityFlowIndex: number;
  activityFlowId: string;
  activityFlowHidden: boolean;
  removeActivityFlow: () => void;
  editActivityFlow: (id: string) => void;
  duplicateActivityFlow: (index: number) => void;
  toggleActivityFlowVisibility: (index: number) => void;
  'data-testid'?: string;
};
