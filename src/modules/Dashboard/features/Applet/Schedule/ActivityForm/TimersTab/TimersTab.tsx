import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { TimePicker, ToggleButtonGroup } from 'shared/components';
import { StyledBodyLarge, StyledBodyMedium, theme } from 'shared/styles';
import { SelectController } from 'shared/components/FormComponents';
import { TimerType } from 'modules/Dashboard/api';

import { timersButtons, idleTimeOptions } from './TimersTab.const.';
import { FormValues } from '../ActivityForm.types';

export const TimersTab = () => {
  const { t } = useTranslation('app');
  const { watch, setValue, control } = useFormContext<FormValues>();
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
          <SelectController
            control={control}
            name="idleTime"
            label={t('duration')}
            options={idleTimeOptions}
            fullWidth
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: '20rem',
                  },
                },
              },
            }}
            customLiStyles={{ padding: `${theme.spacing(1, 1.6)} !important` }}
            isLabelTranslated={false}
          />
        </>
      )}
    </>
  );
};
