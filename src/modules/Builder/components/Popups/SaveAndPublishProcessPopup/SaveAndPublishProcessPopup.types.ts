export const enum SaveAndPublishSteps {
  AtLeastOneActivity = 'atLeastOneActivity',
  AtLeastOneItem = 'atLeastOneItem',
  BeingCreated = 'beingCreated',
  Success = 'success',
  Failed = 'failed',
}

export type SaveAndPublishProcessPopupProps = {
  isPopupVisible: boolean;
  onClose: () => void;
  onRetry: () => void;
  step?: SaveAndPublishSteps;
};
