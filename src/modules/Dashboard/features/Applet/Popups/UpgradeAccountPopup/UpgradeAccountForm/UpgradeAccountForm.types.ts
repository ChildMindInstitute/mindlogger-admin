import { Control } from 'react-hook-form';

import { UpgradeAccountFormValues } from '../UpgradeAccountPopup.types';

export type UpgradeAccountFormProps = {
  control: Control<UpgradeAccountFormValues>;
  onSubmit: () => void;
  'data-testid'?: string;
};
