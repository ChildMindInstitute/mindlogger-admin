import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputController, SelectController } from 'shared/components/FormComponents';
import {
  useBuilderSessionStorageFormChange,
  useBuilderSessionStorageFormValues,
} from 'shared/hooks';
import { RetentionPeriods } from 'shared/types';

import { StyledAppletSettingsDescription, StyledHeadline } from '../AppletSettings.styles';
import { periods, defaultValues } from './DataRetention.const';
import { dataRetentionSchema } from './DataRetention.schema';
import { StyledButton, StyledContainer, StyledInputWrapper } from './DataRetention.styles';
import { DataRetentionFormValues } from './DataRetention.types';

export const DataRetention = () => {
  const { t } = useTranslation();
  const { appletId: id } = useParams();
  const { getFormValues } =
    useBuilderSessionStorageFormValues<DataRetentionFormValues>(defaultValues);
  const { handleSubmit, control, watch, register, unregister, getValues } =
    useForm<DataRetentionFormValues>({
      mode: 'onChange',
      resolver: yupResolver(dataRetentionSchema()),
      defaultValues: getFormValues(),
    });
  const watchPeriod = watch('period');

  const { handleFormChange } =
    useBuilderSessionStorageFormChange<DataRetentionFormValues>(getValues);

  // TODO: connect when the API is ready
  const onSubmit = async ({ period, periodNumber }: DataRetentionFormValues) => {
    if (id) {
      console.log('data retention values: ', period, periodNumber);
    }
  };

  useEffect(() => {
    if (watchPeriod === RetentionPeriods.Indefinitely) {
      unregister('periodNumber', { keepDefaultValue: true });
    } else {
      register('periodNumber');
    }
  }, [watchPeriod, register, unregister]);

  return (
    <>
      <StyledHeadline>{t('dataRetention')}</StyledHeadline>
      <StyledAppletSettingsDescription>{t('selectDataRetention')}</StyledAppletSettingsDescription>
      <form noValidate onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange}>
        <StyledContainer>
          {watchPeriod !== RetentionPeriods.Indefinitely && (
            <StyledInputWrapper>
              <InputController
                name="periodNumber"
                control={control}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </StyledInputWrapper>
          )}
          <SelectController name="period" control={control} fullWidth options={periods} />
        </StyledContainer>
        <StyledButton variant="outlined" type="submit">
          {t('save')}
        </StyledButton>
      </form>
    </>
  );
};
