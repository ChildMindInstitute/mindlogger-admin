import { ModalProps } from 'shared/components';
import { ParticipantDropdownOption, ParticipantDropdownProps } from 'modules/Dashboard/components';
import { Activity } from 'redux/modules';
import { HydratedActivityFlow } from 'modules/Dashboard/types';
import { ParticipantActivityOrFlow } from 'api';

export type UseTakeNowModalProps = {
  dataTestId: string;
};

export type TakeNowModalProps = Partial<Pick<ModalProps, 'onClose'>>;

export type OpenTakeNowModalOptions = {
  /**
   * The ID of the subject who should be selected by default in the "Who are the responses about?" dropdown.
   */
  targetSubject?: ParticipantDropdownOption;

  /**
   * The ID of the participant who should be selected by default in the "Who will be providing the responses?" dropdown.
   */
  sourceSubject?: ParticipantDropdownOption;
};

export type OpenTakeNowModal = (
  activityOrFlow: Activity | HydratedActivityFlow | ParticipantActivityOrFlow,
  options?: OpenTakeNowModalOptions,
) => void;

export type TakeNowDropdownProps = ParticipantDropdownProps & {
  label: string;
  tooltip?: string;
  canShowWarningMessage?: boolean;
};
