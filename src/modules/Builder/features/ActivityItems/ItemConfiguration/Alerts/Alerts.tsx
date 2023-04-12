import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledTitleLarge, theme } from 'shared/styles';

import { Alert } from './Alert';
import { AlertProps } from './Alerts.types';

export const Alerts = ({ name, appendAlert, removeAlert, alerts }: AlertProps) => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledTitleLarge sx={{ m: theme.spacing(4, 0, 2.4) }}>{t('alerts')}</StyledTitleLarge>
      {alerts.map((alert, i) => (
        <Alert name={name} key={alert.id} {...alert} index={i} removeAlert={() => removeAlert(i)} />
      ))}
      <Button
        variant="outlined"
        sx={{ margin: theme.spacing(2.4, 0), display: 'flex' }}
        startIcon={<Svg id="add" width={18} height={18} />}
        onClick={appendAlert}
      >
        {t('addAlert')}
      </Button>
    </>
  );
};
