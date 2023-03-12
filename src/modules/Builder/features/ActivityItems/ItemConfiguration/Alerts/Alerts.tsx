import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { StyledBuilderBtn } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { ItemConfigurationForm } from '../ItemConfiguration.types';
import { Alert, items, options } from './Alert';
//import { alerts } from './Alerts.const';

export const Alerts = ({ appendAlert, removeAlert, alerts }: any) => {
  const { t } = useTranslation('app');
  const props = useFormContext<ItemConfigurationForm>();
  console.log(props);

  return (
    <>
      {alerts.map((el: any, i: any) => (
        <Alert key={el.id} {...el} index={i} removeAlert={removeAlert} />
      ))}
      <StyledBuilderBtn
        sx={{ margin: theme.spacing(0, 'auto', 0), display: 'flex' }}
        startIcon={<Svg id="add" width={18} height={18} />}
        onClick={() => appendAlert({ option: options[0].value, item: items[0].value, message: '' })}
      >
        {t('addItem')}
      </StyledBuilderBtn>
    </>
  );
};
