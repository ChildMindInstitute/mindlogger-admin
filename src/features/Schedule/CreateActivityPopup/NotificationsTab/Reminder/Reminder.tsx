import { useTranslation } from 'react-i18next';

import { TimePicker, Svg } from 'components';
import { InputController } from 'components/FormComponents';

import { Box } from '@mui/material';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { StyledReminder, StyledInputWrapper } from './Reminder.styles';
import { StyledLogo } from '../Notification/Notification.styles';

export const Reminder = () => {
  const { t } = useTranslation('app');

  return (
    <>
      <Box>
        <StyledLogo>
          <Svg id="mind-logger-logo" />
          <StyledLabelLarge sx={{ marginLeft: theme.spacing(1) }}>MindLogger</StyledLabelLarge>
        </StyledLogo>
      </Box>
      <StyledReminder>
        <StyledInputWrapper>
          <InputController
            label={t('activityIncomplete')}
            type="number"
            name="reminder.activityIncomplete"
            //control={control}
            InputProps={{ inputProps: { min: 1 } }}
            endTextAdornmentSingular={t('day')}
            endTextAdornmentPlural={t('days')}
            tooltip={t('numberOfConsecutiveDays')}
          />
        </StyledInputWrapper>
        <TimePicker name="reminder.reminderTime" label={t('reminderTime')} width={26} />
      </StyledReminder>
    </>
  );
};
