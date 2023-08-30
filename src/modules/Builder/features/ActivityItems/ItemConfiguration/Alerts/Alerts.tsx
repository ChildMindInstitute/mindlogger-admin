import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { StyledTitleLarge, theme } from 'shared/styles';
import { ItemAlert } from 'shared/state';

import { Alert } from './Alert';
import { AlertProps } from './Alerts.types';

export const Alerts = ({ name, appendAlert, removeAlert }: AlertProps) => {
  const { t } = useTranslation('app');
  const { watch } = useFormContext();

  const alerts = watch(`${name}.alerts`);

  return (
    <>
      <StyledTitleLarge sx={{ m: theme.spacing(4, 0, 2.4) }}>{t('alerts')}</StyledTitleLarge>
      {alerts?.map(({ key, ...alert }: ItemAlert, i: number) => (
        <Alert
          key={`alert-${key}`}
          name={name}
          {...alert}
          index={i}
          removeAlert={() => removeAlert(i)}
        />
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
    </>
  );
};
