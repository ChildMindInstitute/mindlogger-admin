import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { setHours, setMinutes } from 'date-fns';

import { TimePicker, ToggleButtonGroup } from 'shared/components';
import { StyledBodyLarge, StyledBodyMedium, theme } from 'shared/styles';
import { TimerType } from 'modules/Dashboard/api';

import { EventFormValues } from '../EventForm.types';
import { timersButtons } from './TimersTab.const.';
import { StyledTimePickerWrapper } from './TimersTab.styles';

export const TimersTab = () => {
  const { t } = useTranslation('app');
  const { watch, setValue } = useFormContext<EventFormValues>();
  const activeTimer = watch('timerType');

  const handleSetTimerType = (timerType: string) => setValue('timerType', timerType as TimerType);

  return (
    <>
      <StyledBodyMedium sx={{ mb: theme.spacing(1.2) }}>{t('setTimeLimit')}</StyledBodyMedium>
      <ToggleButtonGroup
        toggleButtons={timersButtons}
        activeButton={activeTimer}
        setActiveButton={handleSetTimerType}
      />
      {activeTimer === TimerType.Timer && (
        <>
          <StyledBodyLarge sx={{ margin: theme.spacing(2.4, 0) }}>
            {t('timeToCompleteActivity')}
          </StyledBodyLarge>
          <TimePicker name="timerDuration" label={t('duration')} />
        </>
      )}
      {activeTimer === TimerType.Idle && (
        <>
          <StyledBodyLarge sx={{ margin: theme.spacing(2.4, 0) }}>
            {t('maximumTimeAwayFromActivity')}
          </StyledBodyLarge>
          <StyledTimePickerWrapper>
            <TimePicker
              name="idleTime"
              label={t('duration')}
              minTime={setHours(setMinutes(new Date(), 15), 0)}
              maxTime={setHours(setMinutes(new Date(), 45), 0)}
            />
          </StyledTimePickerWrapper>
        </>
      )}
    </>
  );
};
