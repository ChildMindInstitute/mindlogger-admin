import { ModalProps } from 'shared/components';

import { ParticipantDropdownOption } from './LabeledDropdown/LabeledUserDropdown.types';

export type UseTakeNowModalProps = {
  dataTestId: string;
};

export type TakeNowModalProps = Partial<Pick<ModalProps, 'onClose'>>;

export type OpenTakeNowModalOptions = {
  /**
   * The ID of the subject who should be selected by default in the "Who is this activity about?" dropdown.
   */
  subject?: ParticipantDropdownOption;

  /**
   * The ID of the participant who should be selected by default in the "Who is responding?" dropdown.
   */
  participant?: ParticipantDropdownOption;
};
