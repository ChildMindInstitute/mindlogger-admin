import { useEffect, useState, KeyboardEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputController, SelectController } from 'shared/components/FormComponents';
import { SaveChangesPopup } from 'shared/components';
import { useAsync } from 'shared/hooks/useAsync';
import { RetentionPeriods } from 'shared/types';
import { applet, banners } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { postAppletDataRetentionApi } from 'api';

import { usePrompt } from '../AppletSettings.hooks';
import { StyledAppletSettingsDescription } from '../AppletSettings.styles';
import {
  retentionTypes,
  DEFAULT_RETENTION_TYPE,
  DEFAULT_RETENTION_PERIOD,
  PREVENTED_CODES,
} from './DataRetention.const';
import { dataRetentionSchema } from './DataRetention.schema';
import { StyledButton, StyledContainer, StyledInputWrapper } from './DataRetention.styles';
import { DataRetentionFormValues } from './DataRetention.types';
import { ErrorPopup } from './Popups';

export const DataRetention = ({ isDashboard }: { isDashboard?: boolean }) => {
  const { t } = useTranslation();
  const { appletId: id } = useParams();
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { getApplet } = applet.thunk;
  const { updateAppletData } = applet.actions;

  const defaultValues = {
    retentionPeriod: appletData?.retentionPeriod || DEFAULT_RETENTION_PERIOD,
    retentionType: appletData?.retentionType || DEFAULT_RETENTION_TYPE,
  };

  const {
    handleSubmit,
    control,
    watch,
    register,
    unregister,
    getValues,
    reset,
    formState: { isDirty, isSubmitted },
  } = useForm<DataRetentionFormValues>({
    mode: 'onChange',
    resolver: yupResolver(dataRetentionSchema()),
    defaultValues,
  });

  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const { promptVisible, confirmNavigation, cancelNavigation } = usePrompt(isDirty && !isSubmitted);
  const { execute: saveDataRetention } = useAsync(
    postAppletDataRetentionApi,
    () => {
      dispatch(
        banners.actions.addBanner({
          key: 'SaveSuccessBanner',
          bannerProps: {
            'data-testid': `${dataTestid}-success-popup`,
            onClose: confirmNavigation,
          },
        }),
      );
    },
    () => setErrorPopupVisible(true),
  );

  const watchRetentionType = watch('retentionType');
  const dataTestid = 'applet-settings-data-retention';

  const onSubmit = async ({ retentionPeriod, retentionType }: DataRetentionFormValues) => {
    if (id) {
      await saveDataRetention({ appletId: id, period: retentionPeriod, retention: retentionType });
      await dispatch(getApplet({ appletId: id }));
    }

    const values = getValues() ?? {};
    if (!isDashboard) dispatch(updateAppletData(values));
  };

  const handleDontSave = () => {
    reset(defaultValues);
    confirmNavigation();
  };

  const handleSaveChanges = async () => {
    await handleSubmit(onSubmit)();
    await dispatch(getApplet({ appletId: id! }));
  };

  const handleCancel = () => {
    cancelNavigation();
  };

  const handlePeriodKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Prevent the dot/comma key from being entered
    if (PREVENTED_CODES.includes(event.code)) {
      event.preventDefault();
    }
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
      <StyledAppletSettingsDescription>{t('selectDataRetention')}</StyledAppletSettingsDescription>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <StyledContainer>
          {watchRetentionType !== RetentionPeriods.Indefinitely && (
            <StyledInputWrapper>
              <InputController
                name="retentionPeriod"
                control={control}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                minNumberValue={DEFAULT_RETENTION_PERIOD}
                onKeyDown={handlePeriodKeyDown}
                data-testid={`${dataTestid}-retention-period`}
              />
            </StyledInputWrapper>
          )}
          <SelectController
            name="retentionType"
            control={control}
            fullWidth
            options={retentionTypes}
            data-testid={`${dataTestid}-retention-type`}
          />
        </StyledContainer>
        <StyledButton variant="outlined" type="submit" data-testid={`${dataTestid}-save`}>
          {t('save')}
        </StyledButton>
      </form>
      {errorPopupVisible && (
        <ErrorPopup
          popupVisible={errorPopupVisible}
          setPopupVisible={setErrorPopupVisible}
          retryCallback={handleSubmit(onSubmit)}
          data-testid={`${dataTestid}-error-popup`}
        />
      )}
      {promptVisible && (
        <SaveChangesPopup
          popupVisible={promptVisible}
          onDontSave={handleDontSave}
          onCancel={handleCancel}
          onSave={handleSaveChanges}
          data-testid={`${dataTestid}-save-changes-popup`}
        />
      )}
    </>
  );
};
