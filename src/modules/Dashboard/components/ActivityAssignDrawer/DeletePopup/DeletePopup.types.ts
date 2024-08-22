export type DeletePopupProps = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onConfirm: () => void;
  activityName?: string;
  'data-testid': string;
};
