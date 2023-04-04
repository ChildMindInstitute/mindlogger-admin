export const enum SavaAndPublishStep {
  AtLeast1Activity = 'atLeast1Activity',
  AtLeast1Item = 'atLeast1Item',
  BeingCreated = 'beingCreated',
  Success = 'success',
  Failed = 'failed',
}

export type SaveAndPublishProcessPopupProps = {
  isPopupVisible: boolean;
  onClose: () => void;
  onRetry: () => void;
  step?: SavaAndPublishStep;
};
