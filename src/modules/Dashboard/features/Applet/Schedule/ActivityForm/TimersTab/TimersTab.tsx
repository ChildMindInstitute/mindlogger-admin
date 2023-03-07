import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { TimePicker, ToggleButtonGroup } from 'shared/components';
import theme from 'shared/styles/theme';
import { StyledBodyLarge } from 'shared/styles/styledComponents';

import { Timers, timersButtons } from './TimersTab.const.';
import { FormValues } from '../';

export const TimersTab = () => {
  const { t } = useTranslation('app');
  const { setValue } = useFormContext<FormValues>();
  const [activeTimer, setActiveTimer] = useState<string>(Timers.NoTimeLimit);

  const updateTimers = () => {
    setValue('timerDuration', '');
    setValue('idleTime', '');
  };

  return (
    <>
      <ToggleButtonGroup
        toggleButtons={timersButtons}
        activeButton={activeTimer}
        setActiveButton={setActiveTimer}
        customChange={updateTimers}
      />
      {activeTimer === Timers.Timer && (
        <>
          <StyledBodyLarge sx={{ margin: theme.spacing(2.4, 0) }}>
            {t('timeToCompleteActivity')}
          </StyledBodyLarge>
          <TimePicker name="timerDuration" label={t('duration')} />
        </>
      )}
      {activeTimer === Timers.IdleTime && (
        <>
          <StyledBodyLarge sx={{ margin: theme.spacing(2.4, 0) }}>
            {t('maximumTimeAwayFromActivity')}
          </StyledBodyLarge>
          <TimePicker format="mm" name="idleTime" label={t('duration')} />
        </>
      )}
    </>
  );
};
