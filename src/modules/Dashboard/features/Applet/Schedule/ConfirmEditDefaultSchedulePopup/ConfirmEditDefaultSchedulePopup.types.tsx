import { ModalProps } from 'shared/components';

export interface ConfirmEditDefaultSchedulePopupProps
  extends Omit<ModalProps, 'children' | 'title'> {
  appletId?: string;
  canCreateIndividualSchedule?: boolean;
  dataTestId?: string;
  onOpenFollowUpPopup?: () => void;
  respondentName?: string;
  userId?: string;
}
