import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { CheckboxController } from 'components/FormComponents';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';

import { ToggleButtonGroup } from 'components/ToggleButtonGroup';

import { TimePicker } from 'components/TimePicker';
import { options } from './Availability.const';
import { AvailabilityProps } from './Availability.props.types';

export const Availability = ({ control }: AvailabilityProps) => {
  const { t } = useTranslation('app');

  const [activeButton, setActiveButton] = useState('');
  const [date, setDate] = useState<Date | undefined | null>(new Date());

  const togglebuttons = [
    {
      value: 'once',
      label: 'Once',
    },
    {
      value: 'Daily',
      label: 'Daily',
    },
    {
      value: 'Weekly',
      label: 'Weekly',
    },
    {
      value: 'Weekdays',
      label: 'Weekdays',
    },
    {
      value: 'Monthly',
      label: 'Monthly',
    },
  ];

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
      <ToggleButtonGroup
        toggleButtons={togglebuttons}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />
      <TimePicker value={date} setValue={setDate} label="From" />
      <TimePicker value={date} setValue={setDate} label="To" />
      <CheckboxController
        name="oneTimeCompletion"
        control={control}
        label={<StyledBodyMedium>{t('oneTimeCompletion')}</StyledBodyMedium>}
      />
    </>
  );
};
