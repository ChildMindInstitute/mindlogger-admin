import { useTranslation } from 'react-i18next';
import { UseControllerProps } from 'react-hook-form';

import { DatePicker, DatePickerUiType } from 'components';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { ItemConfigurationForm } from '../../ItemConfiguration.types';

export const Date = ({ name, control }: UseControllerProps<ItemConfigurationForm>) => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer title={t('dateItemTitle')} description={t('dateItemDescription')}>
      <DatePicker
        name={name}
        control={control}
        uiType={DatePickerUiType.OneDate}
        inputSx={{
          width: '35rem',
        }}
      />
    </ItemOptionContainer>
  );
};
