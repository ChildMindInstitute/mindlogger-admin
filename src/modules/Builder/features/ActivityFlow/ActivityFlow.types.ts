export type GetActivityFlowActions = {
  activityFlowIndex: number;
  activityFlowId: string;
  activityFlowHidden: boolean;
  removeActivityFlow: (index: number) => void;
  editActivityFlow: (id: string) => void;
  duplicateActivityFlow: (index: number) => void;
  toggleActivityFlowVisibility: (index: number) => void;
};
