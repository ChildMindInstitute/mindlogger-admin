import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { theme } from 'shared/styles';

import { Alert, items, options } from './Alert';
import { AlertProps } from './Alerts.types';

export const Alerts = ({ appendAlert, removeAlert, alerts }: AlertProps) => {
  const { t } = useTranslation('app');

  return (
    <>
      {alerts.map((el, i) => (
        <Alert key={el.id} {...el} index={i} removeAlert={removeAlert} />
      ))}
      <Button
        variant="outlined"
        sx={{ margin: theme.spacing(0, 'auto', 2.4), display: 'flex' }}
        startIcon={<Svg id="add" width={18} height={18} />}
        onClick={() => appendAlert({ option: options[0].value, item: items[0].value, message: '' })}
      >
        {t('addAlert')}
      </Button>
    </>
  );
};
