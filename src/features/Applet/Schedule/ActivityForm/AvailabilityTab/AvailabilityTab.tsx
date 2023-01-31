import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { CheckboxController } from 'components/FormComponents';
import { TimePicker, DatePicker, DatePickerUiType, ToggleButtonGroup } from 'components';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { availabilityOptions, repeatsButtons, Repeats } from './Availability.const';
import {
  StyledButtonsTitle,
  StyledTimeRow,
  StyledTimeWrapper,
  StyledWrapper,
} from './AvailabilityTab.styles';
import { FormValues } from '../';

export const AvailabilityTab = () => {
  const { t } = useTranslation('app');
  const [activeRepeat, setActiveRepeat] = useState<string>(Repeats.once);
  const {
    control,
    watch,
    setValue,
    formState: { dirtyFields },
  } = useFormContext<FormValues>();
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
      {dirtyFields.availability && (
        <StyledBodyMedium sx={{ marginLeft: theme.spacing(1.6) }} color={variables.palette.primary}>
          {t(availability ? 'alwaysAvailableWarning' : 'scheduledAccessWarning')}
        </StyledBodyMedium>
      )}
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
            <DatePicker
              name="startEndingDate"
              control={control}
              uiType={DatePickerUiType.startEndingDate}
            />
          ) : (
            <DatePicker name="date" control={control} uiType={DatePickerUiType.oneDate} />
          )}
        </>
      )}
    </>
  );
};
