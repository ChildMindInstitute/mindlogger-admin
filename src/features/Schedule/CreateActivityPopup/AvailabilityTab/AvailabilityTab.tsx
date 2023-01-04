import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { CheckboxController } from 'components/FormComponents';
import { TimePicker, DatePicker, UiType, ToggleButtonGroup } from 'components';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';

import { availabilityOptions, repeatsButtons, Repeats } from './Availability.const';
import {
  StyledButtonsTitle,
  StyledTimeRow,
  StyledTimeWrapper,
  StyledWrapper,
} from './AvailabilityTab.styles';
import { FormValues } from '../CreateActivityPopup.types';

export const AvailabilityTab = () => {
  const { t } = useTranslation('app');
  const [activeRepeat, setActiveRepeat] = useState<string>(Repeats.once);
  const { control, watch, setValue } = useFormContext<FormValues>();
  const availability = watch('availability');

  const updateDate = () => {
    setValue('date', '');
    setValue('startEndingDate', '');
  };

  const availabilityOnChange = () => {
    updateDate();
    setValue('completion', false);
    setValue('from', '');
    setValue('to', '');
    setValue('timeout.access', false);
  };

  return (
    <>
      <SelectController
        name="availability"
        fullWidth
        options={availabilityOptions}
        control={control}
        customChange={availabilityOnChange}
      />
      {availability ? (
        <StyledWrapper>
          <CheckboxController
            name="completion"
            control={control}
            label={<StyledBodyMedium>{t('oneTimeCompletion')}</StyledBodyMedium>}
          />
        </StyledWrapper>
      ) : (
        <>
          <StyledWrapper>
            <StyledButtonsTitle>{t('usersCanAccessActivity')}</StyledButtonsTitle>
            <ToggleButtonGroup
              toggleButtons={repeatsButtons}
              activeButton={activeRepeat}
              setActiveButton={setActiveRepeat}
              customChange={updateDate}
            />
          </StyledWrapper>
          <StyledTimeRow>
            <StyledTimeWrapper>
              <TimePicker name="from" control={control} label={t('from')} />
            </StyledTimeWrapper>
            <StyledTimeWrapper sx={{ marginLeft: theme.spacing(2.4) }}>
              <TimePicker name="to" control={control} label={t('to')} />
            </StyledTimeWrapper>
          </StyledTimeRow>
          <StyledWrapper>
            <CheckboxController
              name="timeout.access"
              control={control}
              label={<StyledBodyMedium>{t('allowAccessBeforeTime')}</StyledBodyMedium>}
            />
          </StyledWrapper>
          {activeRepeat !== Repeats.once ? (
            <DatePicker name="startEndingDate" control={control} uiType={UiType.startEndingDate} />
          ) : (
            <DatePicker name="date" control={control} uiType={UiType.oneDate} />
          )}
        </>
      )}
    </>
  );
};
