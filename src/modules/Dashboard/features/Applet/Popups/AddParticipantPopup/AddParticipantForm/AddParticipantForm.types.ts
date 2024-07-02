import { Control } from 'react-hook-form';

import { AccountType } from 'modules/Dashboard/types/Dashboard.types';

import { AddParticipantFormValues } from '../AddParticipantPopup.types';

export type AddParticipantFormProps = {
  accountType: AccountType;
  control: Control<AddParticipantFormValues>;
  onSubmit: () => void;
  'data-testid'?: string;
};
