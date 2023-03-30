export type ImportSchedulePopupProps = {
  isIndividual?: boolean;
  appletName: string;
  secretUserId: string;
  nickName: string;
  open: boolean;
  onClose: () => void;
};

export type Steps = 0 | 1 | 2;
