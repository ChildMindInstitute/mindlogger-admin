import { Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledTitleLarge, theme } from 'shared/styles';

import { Alert } from './Alert';
import { AlertProps } from './Alerts.types';

export const Alerts = ({ name, appendAlert, removeAlert, alerts }: AlertProps) => {
  const { t } = useTranslation('app');

  return (
    <Box>
      <StyledTitleLarge sx={{ m: theme.spacing(4, 0, 2.4) }}>{t('alerts')}</StyledTitleLarge>
      {alerts?.map((alert, i: number) => (
        <Alert key={alert.id} name={name} index={i} removeAlert={() => removeAlert(i)} />
      ))}
      <Button
        variant="outlined"
        sx={{ margin: theme.spacing(2.4, 0), display: 'flex' }}
        startIcon={<Svg id="add" width={18} height={18} />}
        onClick={appendAlert}
        data-testid="builder-activity-items-item-configuration-add-alert"
      >
        {t('addAlert')}
      </Button>
    </Box>
  );
};
