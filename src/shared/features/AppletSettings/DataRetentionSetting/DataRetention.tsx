import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputController, SelectController } from 'shared/components/FormComponents';
import { SaveChangesPopup } from 'shared/components';
import {
  useAsync,
  useBuilderSessionStorageFormChange,
  useBuilderSessionStorageFormValues,
} from 'shared/hooks';
import { RetentionPeriods } from 'shared/types';
import { postAppletDataRetentionApi } from 'api';

import { usePrompt } from '../AppletSettings.hooks';
import { StyledAppletSettingsDescription, StyledHeadline } from '../AppletSettings.styles';
import { retentionTypes, defaultValues } from './DataRetention.const';
import { dataRetentionSchema } from './DataRetention.schema';
import { StyledButton, StyledContainer, StyledInputWrapper } from './DataRetention.styles';
import { DataRetentionFormValues } from './DataRetention.types';
import { ErrorPopup, SuccessPopup } from './Popups';

export const DataRetention = () => {
  const { t } = useTranslation();
  const { appletId: id } = useParams();
  const { getFormValues } =
    useBuilderSessionStorageFormValues<DataRetentionFormValues>(defaultValues);
  const {
    handleSubmit,
    control,
    watch,
    register,
    unregister,
    getValues,
    formState: { isDirty, isSubmitted },
  } = useForm<DataRetentionFormValues>({
    mode: 'onChange',
    resolver: yupResolver(dataRetentionSchema()),
    defaultValues: getFormValues(),
  });

  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const { promptVisible, confirmNavigation, cancelNavigation } = usePrompt(isDirty && !isSubmitted);
  const { execute: saveDataRetention } = useAsync(
    postAppletDataRetentionApi,
    () => setSuccessPopupVisible(true),
    () => setErrorPopupVisible(true),
  );

  const watchRetentionType = watch('retentionType');

  const { handleFormChange } =
    useBuilderSessionStorageFormChange<DataRetentionFormValues>(getValues);

  const onSubmit = async ({ retentionPeriod = 1, retentionType }: DataRetentionFormValues) => {
    if (id) {
      saveDataRetention({ appletId: id, period: retentionPeriod, retention: retentionType });
    }
  };

  const handleSaveChanges = () => {
    cancelNavigation();
    handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    cancelNavigation();
  };

  useEffect(() => {
    if (watchRetentionType === RetentionPeriods.Indefinitely) {
      unregister('retentionPeriod', { keepDefaultValue: true });
    } else {
      register('retentionPeriod');
    }
  }, [watchRetentionType, register, unregister]);

  return (
    <>
      <StyledHeadline>{t('dataRetention')}</StyledHeadline>
      <StyledAppletSettingsDescription>{t('selectDataRetention')}</StyledAppletSettingsDescription>
      <form noValidate onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange}>
        <StyledContainer>
          {watchRetentionType !== RetentionPeriods.Indefinitely && (
            <StyledInputWrapper>
              <InputController
                name="retentionPeriod"
                control={control}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </StyledInputWrapper>
          )}
          <SelectController
            name="retentionType"
            control={control}
            fullWidth
            options={retentionTypes}
          />
        </StyledContainer>
        <StyledButton variant="outlined" type="submit">
          {t('save')}
        </StyledButton>
      </form>
      {errorPopupVisible && (
        <ErrorPopup
          popupVisible={errorPopupVisible}
          setPopupVisible={setErrorPopupVisible}
          retryCallback={handleSubmit(onSubmit)}
        />
      )}
      {successPopupVisible && (
        <SuccessPopup popupVisible={successPopupVisible} setPopupVisible={setSuccessPopupVisible} />
      )}
      {promptVisible && (
        <SaveChangesPopup
          popupVisible={promptVisible}
          onDontSave={confirmNavigation}
          onCancel={handleCancel}
          onSave={handleSaveChanges}
        />
      )}
    </>
  );
};
