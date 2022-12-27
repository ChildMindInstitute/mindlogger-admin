import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { CheckboxController } from 'components/FormComponents';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';

import { options } from './Availability.const';
import { AvailabilityProps } from './Availability.props.types';

export const Availability = ({ control }: AvailabilityProps) => {
  const { t } = useTranslation('app');

  return (
    <>
      <SelectController
        name="availability"
        fullWidth
        options={options}
        label=""
        control={control}
      />
      <CheckboxController
        name="oneTimeCompletion"
        control={control}
        label={<StyledBodyMedium>{t('oneTimeCompletion')}</StyledBodyMedium>}
      />
    </>
  );
};
