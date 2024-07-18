import { ModalProps } from 'shared/components';
import { ParticipantDropdownOption } from 'modules/Dashboard/components';

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
