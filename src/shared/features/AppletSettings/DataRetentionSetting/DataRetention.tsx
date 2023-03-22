import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputController, SelectController } from 'shared/components/FormComponents';
import { updateDataRetention } from 'modules/Dashboard/state/Applet/Applet.thunk';
import { useAppDispatch } from 'redux/store';

import { periods } from './DataRetention.const';
import { StyledAppletSettingsDescription, StyledHeadline } from '../AppletSettings.styles';
import { defaultValues } from './DataRetention.const';
import { dataRetentionSchema } from './DataRetention.schema';
import { StyledButton, StyledContainer, StyledInputWrapper } from './DataRetention.styles';
import { FormValues } from './DataRetention.types';

export const DataRetention = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { handleSubmit, control, watch, register, unregister, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(dataRetentionSchema()),
    defaultValues,
  });
  const watchPeriod = watch('period');

  const onSubmit = async ({ period, periodNumber }: FormValues) => {
    if (id) {
      await dispatch(
        updateDataRetention({ appletId: id, retention: period, period: periodNumber }),
      );
    }
  };

  useEffect(() => {
    if (watchPeriod === 'indefinitely') {
      unregister('periodNumber', { keepDefaultValue: true });
    } else {
      register('periodNumber');
    }
  }, [watchPeriod, register, unregister]);

  return (
    <>
      <StyledHeadline>{t('dataRetention')}</StyledHeadline>
      <StyledAppletSettingsDescription>{t('selectDataRetention')}</StyledAppletSettingsDescription>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <StyledContainer>
          {watchPeriod !== 'indefinitely' && (
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
