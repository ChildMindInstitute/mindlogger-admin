import { RespondentStatus } from 'modules/Dashboard/types';

export type StatusFlagProps = {
  status: RespondentStatus;
  isInviteDisabled: boolean;
  onInviteClick?: () => void;
};
