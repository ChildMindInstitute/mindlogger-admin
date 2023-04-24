import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CheckboxController, SelectController } from 'shared/components/FormComponents';
import { TimePicker, DatePicker, DatePickerUiType, ToggleButtonGroup } from 'shared/components';
import { StyledBodyMedium } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { Periodicity } from 'modules/Dashboard/api';

import { EventFormValues } from '../EventForm.types';
import { availabilityOptions, repeatsButtons } from './Availability.const';
import {
  StyledButtonsTitle,
  StyledTimeRow,
  StyledTimeWrapper,
  StyledWrapper,
  StyledDatePickerWrapper,
} from './AvailabilityTab.styles';

export const AvailabilityTab = () => {
  const { t } = useTranslation('app');
  const {
    control,
    watch,
    setValue,
    formState: { dirtyFields },
  } = useFormContext<EventFormValues>();
  const alwaysAvailable = watch('alwaysAvailable');
  const periodicity = watch('periodicity');
  const date = watch('date');
  const startEndingDate = watch('startEndingDate');
  const startTime = watch('startTime');

  const handleSetPeriodicity = (period: string) => setValue('periodicity', period as Periodicity);

  const getDatePicker = () => {
    if (periodicity === Periodicity.Once) {
      return (
        <StyledDatePickerWrapper>
          <DatePicker
            name="date"
            value={date}
            control={control}
            uiType={DatePickerUiType.OneDate}
          />
        </StyledDatePickerWrapper>
      );
    }

    return (
      <StyledDatePickerWrapper>
        <DatePicker
          name="startEndingDate"
          value={startEndingDate}
          control={control}
          uiType={DatePickerUiType.StartEndingDate}
        />
      </StyledDatePickerWrapper>
    );
  };

  return (
    <>
      <SelectController
        name="alwaysAvailable"
        fullWidth
        options={availabilityOptions}
        control={control}
      />
      {dirtyFields.alwaysAvailable && (
        <StyledBodyMedium sx={{ marginLeft: theme.spacing(1.6) }} color={variables.palette.primary}>
          {t(alwaysAvailable ? 'alwaysAvailableWarning' : 'scheduledAccessWarning')}
        </StyledBodyMedium>
      )}
      {alwaysAvailable ? (
        <StyledWrapper>
          <CheckboxController
            name="oneTimeCompletion"
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
              activeButton={periodicity}
              setActiveButton={handleSetPeriodicity}
            />
          </StyledWrapper>
          <StyledTimeRow>
            <StyledTimeWrapper>
              <TimePicker name="startTime" control={control} label={t('from')} />
            </StyledTimeWrapper>
            <StyledTimeWrapper sx={{ marginLeft: theme.spacing(2.4) }}>
              <TimePicker name="endTime" control={control} label={t('to')} />
            </StyledTimeWrapper>
          </StyledTimeRow>
          <StyledWrapper>
            <CheckboxController
              disabled={startTime === '00:00'}
              name="accessBeforeSchedule"
              control={control}
              label={<StyledBodyMedium>{t('allowAccessBeforeTime')}</StyledBodyMedium>}
            />
          </StyledWrapper>
          {getDatePicker()}
        </>
      )}
    </>
  );
};
