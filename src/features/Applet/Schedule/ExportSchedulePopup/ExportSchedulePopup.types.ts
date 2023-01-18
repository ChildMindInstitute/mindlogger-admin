import { Row } from 'components';

export type ExportSchedulePopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  scheduleTableRows: Row[] | undefined;
  secretUserId?: string;
  nickName?: string;
};
