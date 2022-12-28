import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { CheckboxController } from 'components/FormComponents';
import { ToggleButtonGroup } from 'components/ToggleButtonGroup';
import { TimePicker } from 'components/TimePicker';
import { DatePicker, UiType } from 'components/DatePicker';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { options, repeatsButtons } from './Availability.const';
import { defaultValues } from '../CreateActivityPopup.const';
import { ConnectForm } from '../context';

export const Availability = () => {
  const { t } = useTranslation('app');

  const [activeRepeat, setActiveRepeat] = useState('');
  const [date, setDate] = useState('');

  return (
    <ConnectForm>
      {({ control, watch, reset }) => {
        const availability = watch('availability');

        return (
          <>
            <SelectController
              name="availability"
              fullWidth
              options={options}
              label=""
              control={control}
              customChange={(e) =>
                reset({
                  ...defaultValues,
                  availability: e.target.value,
                  activity: 'To-Be Mood',
                })
              }
            />
            {availability ? (
              <CheckboxController
                name="completion"
                control={control}
                label={<StyledBodyMedium>{t('oneTimeCompletion')}</StyledBodyMedium>}
              />
            ) : (
              <>
                <ToggleButtonGroup
                  toggleButtons={repeatsButtons}
                  activeButton={activeRepeat}
                  setActiveButton={setActiveRepeat}
                />
                <StyledFlexTopCenter>
                  <TimePicker name="from" control={control} label="From" />
                  <TimePicker name="to" control={control} label="To" />
                </StyledFlexTopCenter>
                <CheckboxController
                  name="timeout.access"
                  control={control}
                  label={<StyledBodyMedium>Allow access before “From” time</StyledBodyMedium>}
                />
                <DatePicker
                  value={date}
                  setValue={setDate}
                  uiType={activeRepeat !== 'once' ? UiType.startEndingDate : UiType.oneDate}
                />
              </>
            )}
          </>
        );
      }}
    </ConnectForm>
  );
};
