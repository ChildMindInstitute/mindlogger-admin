import { ModalProps } from 'shared/components';
import { AutocompleteOption } from 'shared/components/FormComponents';

export type UseTakeNowModalProps = {
  dataTestId: string;
};

export type TakeNowModalProps = Partial<Pick<ModalProps, 'onClose'>>;

export type OpenTakeNowModalOptions = {
  /**
   * The ID of the subject who should be selected by default in the "Who is this activity about?" dropdown.
   */
  subject?: AutocompleteOption;

  /**
   * The ID of the participant who should be selected by default in the "Who is responding?" dropdown.
   */
  participant?: AutocompleteOption;
};
