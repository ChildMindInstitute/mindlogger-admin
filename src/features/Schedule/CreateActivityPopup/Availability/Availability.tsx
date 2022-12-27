import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { CheckboxController } from 'components/FormComponents';
import { ToggleButtonGroup } from 'components/ToggleButtonGroup';
import { TimePicker } from 'components/TimePicker';
import { DatePicker, UiType } from 'components/DatePicker';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { options, togglebuttons } from './Availability.const';
import { ConnectForm } from '../context';

export const Availability = () => {
  const { t } = useTranslation('app');

  const [activeButton, setActiveButton] = useState('');
  const [time, setTime] = useState<Date | undefined | null>(new Date());
  const [date, setDate] = useState('');

  return (
    <ConnectForm>
      {({ control }) => (
        <>
          <SelectController
            name="availability"
            fullWidth
            options={options}
            label=""
            control={control}
          />
          <CheckboxController
            name="completion"
            control={control}
            label={<StyledBodyMedium>{t('oneTimeCompletion')}</StyledBodyMedium>}
          />
          <ToggleButtonGroup
            toggleButtons={togglebuttons}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          <StyledFlexTopCenter>
            <TimePicker value={time} setValue={setTime} label="From" />
            <TimePicker value={time} setValue={setTime} label="To" />
          </StyledFlexTopCenter>
          <CheckboxController
            name="timeout.access"
            control={control}
            label={<StyledBodyMedium>Allow access before “From” time</StyledBodyMedium>}
          />
          <DatePicker value={date} setValue={setDate} uiType={UiType.startEndingDate} />
        </>
      )}
    </ConnectForm>
  );
};
