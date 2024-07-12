import { useEffect, useState, ChangeEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { ObjectSchema } from 'yup';

import {
  postReportConfigApi,
  postActivityReportConfigApi,
  postActivityFlowReportConfigApi,
} from 'modules/Dashboard/api';
import { ApiResponseCodes } from 'shared/api';
import { applet, banners } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { SaveChangesPopup, Svg } from 'shared/components';
import {
  CheckboxController,
  EditorController,
  InputController,
  SelectController,
  TagsController,
  UiType,
} from 'shared/components/FormComponents';
import {
  theme,
  variables,
  StyledBodyLarge,
  StyledTitleMedium,
  StyledFlexColumn,
} from 'shared/styles';
import {
  AppletPasswordPopup,
  AppletPasswordPopupType,
  AppletPasswordPopupProps,
} from 'modules/Dashboard/features/Applet/Popups';
import { useAsync } from 'shared/hooks/useAsync';
import { useIsServerConfigured } from 'shared/hooks/useIsServerConfigured';
import {
  getParsedEncryptionFromServer,
  getPrivateKey,
  publicEncrypt,
} from 'shared/utils/encryption';
import { getSanitizedContent } from 'shared/utils/forms';
import { getEntityKey } from 'shared/utils/getEntityKey';
import { toggleBooleanState } from 'shared/utils/toggleBooleanState';
import { reportConfig } from 'modules/Builder/state';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';
import { useCurrentActivityFlow } from 'modules/Builder/hooks/useCurrentActivityFlow';
import { useCustomFormContext } from 'modules/Builder/hooks/useCustomFormContext';
import { TEXTAREA_ROWS_COUNT_SM } from 'shared/consts';
import { AppletFormValues } from 'modules/Builder/types';
import { usePrompt } from 'shared/features/AppletSettings/AppletSettings.hooks';
import { StyledAppletSettingsButton } from 'shared/features/AppletSettings/AppletSettings.styles';

import { reportConfigSchema } from './ReportConfigSetting.schema';
import {
  StyledButton,
  StyledSvg,
  StyledLink,
  StyledActivities,
} from './ReportConfigSetting.styles';
import { ReportConfigFormValues, ReportConfigSettingProps } from './ReportConfigSetting.types';
import { ErrorPopup, ServerVerifyErrorPopup, WarningPopup } from './Popups';
import {
  getActivitiesOptions,
  getActivityItemsOptions,
  setSubjectData,
} from './ReportConfigSetting.utils';
import { useCheckReportServer, useDefaultValues } from './ReportConfigSetting.hooks';
import { REPORT_SERVER_INSTRUCTIONS_LINK } from './ReportConfigSetting.const';
import { ServerNotConfigured } from './ServerNotConfigured';

export const ReportConfigSetting = ({
  onSubmitSuccess,
  'data-testid': dataTestid,
}: ReportConfigSettingProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { activity, fieldName: activityFieldName } = useCurrentActivity();
  const { activityFlow, fieldName: flowFieldName } = useCurrentActivityFlow();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { saveChanges, doNotSaveChanges } = reportConfig.useReportConfigChanges() || {};
  const { setReportConfigChanges, resetReportConfigChanges } = reportConfig.actions;
  const isServerConfigured = useIsServerConfigured();
  const isActivity = !!activity;
  const isActivityFlow = !!activityFlow;
  const isActivityOrFlow = isActivity || isActivityFlow;
  const { setValue: setAppletFormValue, getValues: getAppletFormValues } =
    useCustomFormContext() || {};
  const appletFormValues = getAppletFormValues?.() as AppletFormValues;
  const defaultValues = useDefaultValues(appletFormValues ?? appletData);

  const [isSettingsOpen, setSettingsOpen] = useState(!isServerConfigured);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [noPermissionVisible, setNoPermissionVisible] = useState(false);
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);
  const [warningPopupVisible, setWarningPopupVisible] = useState(false);
  const [verifyPopupVisible, setVerifyPopupVisible] = useState(false);
  const { updateAppletData } = applet.actions;
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption);
  const { accountId = '' } = encryptionInfoFromServer ?? {};

  const handleSuccess = () => {
    if (!onSubmitSuccess) return;

    onSubmitSuccess(getValues());

    dispatch(
      banners.actions.addBanner({
        key: 'SaveSuccessBanner',
        bannerProps: { onClose: confirmNavigation },
      }),
    );
  };

  const { execute: postReportConfig } = useAsync(postReportConfigApi, handleSuccess, (error) => {
    if (error?.response?.status === ApiResponseCodes.Forbidden) {
      setNoPermissionVisible(true);

      return;
    }

    setErrorPopupVisible(true);
  });
  const { execute: postActivityReportConfig } = useAsync(
    postActivityReportConfigApi,
    handleSuccess,
    (error) => {
      if (error?.response?.status === ApiResponseCodes.Forbidden) {
        setNoPermissionVisible(true);

        return;
      }

      setErrorPopupVisible(true);
    },
  );
  const { execute: postActivityFlowReportConfig } = useAsync(
    postActivityFlowReportConfigApi,
    handleSuccess,
    (error) => {
      if (error?.response?.status === ApiResponseCodes.Forbidden) {
        setNoPermissionVisible(true);

        return;
      }

      setErrorPopupVisible(true);
    },
  );

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    trigger,
    reset,
    formState: { isDirty, isSubmitted, errors },
    setError,
    clearErrors,
  } = useForm<ReportConfigFormValues>({
    resolver: yupResolver(
      reportConfigSchema(isActivity, isActivityFlow) as ObjectSchema<ReportConfigFormValues>,
    ),
    defaultValues,
    mode: 'onSubmit',
  });
  const hasErrors = !!Object.keys(errors).length;
  const { promptVisible, confirmNavigation, cancelNavigation } = usePrompt(
    isDirty && !isSubmitted && !noPermissionVisible,
  );

  const reportRecipients = watch('reportRecipients') || [];
  const includeRespondentId = watch('reportIncludeUserId');
  const reportIncludedActivity = watch('reportIncludedActivityName');
  const reportIncludedItemName = watch('reportIncludedItemName');
  const itemValue = watch('itemValue');
  const reportServerUrl = watch('reportServerIp');
  const reportPublicKey = watch('reportPublicKey');

  const selectedActivity =
    isActivityFlow && reportIncludedActivity
      ? appletFormValues?.activities?.find(
          (activity) => getEntityKey(activity) === reportIncludedActivity,
        )
      : null;

  const { onVerify, onSetPassword } = useCheckReportServer({
    url: reportServerUrl,
    publicKey: reportPublicKey,
  });

  const handleAddEmail = async (value: string) => {
    const isValid = await trigger(['email']);
    if (!isValid) return;

    if (value.length) {
      setValue('email', '');
      if (!reportRecipients.some((item) => item === value)) {
        setValue('reportRecipients', [...reportRecipients, value]);
      }
    }
  };

  const handleRemoveEmail = (index: number) => {
    setValue('reportRecipients', reportRecipients.filter((_, i) => i !== index) as string[], {
      shouldDirty: true,
    });
  };

  const onSubmit = (values: ReportConfigFormValues) => {
    if (activity) return handleSaveActivityReportConfig();

    if (activityFlow) return handleSaveActivityFlowReportConfig();

    const { reportServerIp, reportPublicKey } = values;
    if (!reportServerIp || !reportPublicKey) {
      return setWarningPopupVisible(true);
    }

    if (
      reportServerIp !== defaultValues?.reportServerIp ||
      reportPublicKey !== defaultValues?.reportPublicKey
    ) {
      return handleVerify();
    }

    handleSaveReportConfig();
  };

  const handleSaveReportConfig = async () => {
    const {
      reportServerIp,
      reportPublicKey,
      reportRecipients,
      reportIncludeUserId,
      reportEmailBody,
    } = getValues() ?? {};

    const sanitizedReportEmailBody = getSanitizedContent(reportEmailBody, true);

    const body = {
      reportServerIp,
      reportPublicKey,
      reportRecipients,
      reportIncludeUserId,
      reportEmailBody: sanitizedReportEmailBody,
    };

    await postReportConfig({
      appletId: appletData?.id ?? '',
      ...body,
    });

    dispatch(updateAppletData(body));
    Object.entries(body).forEach(([key, value]) => {
      setAppletFormValue(key, value);
    });

    reset({ ...defaultValues, ...body });
  };

  const handleSaveActivityReportConfig = async () => {
    const { itemValue, reportIncludedItemName: reportIncludedItemKey } = getValues() ?? {};
    const selectedItem = activity?.items.find(
      (item) => getEntityKey(item) === reportIncludedItemKey,
    );

    await postActivityReportConfig({
      appletId: appletData?.id ?? '',
      activityId: activity?.id ?? '',
      reportIncludedItemName: itemValue && selectedItem ? selectedItem.name : '',
    });

    const reportIncludedItemName = itemValue && reportIncludedItemKey ? reportIncludedItemKey : '';
    await setAppletFormValue(`${activityFieldName}.reportIncludedItemName`, reportIncludedItemName);
    reset({ ...defaultValues, itemValue, reportIncludedItemName });
  };

  const handleSaveActivityFlowReportConfig = async () => {
    const {
      itemValue,
      reportIncludedActivityName: reportIncludedActivityKey,
      reportIncludedItemName: reportIncludedItemKey,
    } = getValues() ?? {};
    const selectedItem = selectedActivity?.items.find(
      (item) => getEntityKey(item) === reportIncludedItemKey,
    );

    await postActivityFlowReportConfig({
      appletId: appletData?.id ?? '',
      activityFlowId: activityFlow?.id ?? '',
      reportIncludedActivityName: itemValue && selectedActivity ? selectedActivity.name : '',
      reportIncludedItemName: itemValue && selectedItem ? selectedItem.name : '',
    });

    const reportIncludedActivityName =
      itemValue && reportIncludedActivityKey ? reportIncludedActivityKey : '';
    const reportIncludedItemName = itemValue && reportIncludedItemKey ? reportIncludedItemKey : '';

    await setAppletFormValue(
      `${flowFieldName}.reportIncludedActivityName`,
      reportIncludedActivityName,
    );
    await setAppletFormValue(`${flowFieldName}.reportIncludedItemName`, reportIncludedItemName);
    reset({ ...defaultValues, itemValue, reportIncludedActivityName, reportIncludedItemName });
  };

  const handleVerify = async () => {
    const isVerified = await onVerify();
    if (isVerified) {
      clearErrors(['reportServerIp', 'reportPublicKey']);

      return setPasswordPopupVisible(true);
    }

    setError('reportServerIp', {});
    setError('reportPublicKey', {});
    setVerifyPopupVisible(true);
  };

  const handleSetPassword = async (password: string) => {
    setPasswordPopupVisible(false);

    try {
      const isPasswordSet = await onSetPassword(
        await publicEncrypt(
          JSON.stringify({
            password,
            privateKey: await getPrivateKey({ appletPassword: password, accountId }),
          }),
          reportPublicKey,
        ),
      );

      if (isPasswordSet) handleSaveReportConfig();
    } catch (e) {
      console.error(e);
      setVerifyPopupVisible(true);
    }
  };

  const handleSaveWithoutServer = async () => {
    await handleSaveReportConfig();
  };

  const passwordSubmit: AppletPasswordPopupProps['submitCallback'] = (passwordRef) => {
    handleSetPassword(passwordRef.current?.password ?? '');
  };

  const handleSaveChanges = () => {
    handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    cancelNavigation();
  };

  const getActivityItems = () => {
    if (isActivity) return activity?.items;
    if (isActivityFlow) return selectedActivity?.items;

    return null;
  };
  const itemName = getActivityItems()?.find((item) => getEntityKey(item) === reportIncludedItemName)
    ?.name;

  const subjectDataProps = {
    setValue,
    appletName: appletData?.displayName,
    activityName: activity?.name,
    flowName: activityFlow?.name,
    flowActivityName: selectedActivity?.name,
    respondentId: includeRespondentId,
    hasActivityItemValue: isActivity && itemValue,
    hasFlowItemValue: isActivityFlow && itemValue,
    itemName,
  };

  const handleDontSave = () => {
    reset(defaultValues);
    confirmNavigation();
  };

  const handleChangeItemValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      setValue('reportIncludedActivityName', '');
      setValue('reportIncludedItemName', '');
    }
  };

  const commonSelectProps = {
    control,
    fullWidth: true,
  };

  const handleActivityChange = () => {
    setValue('reportIncludedItemName', '');
  };

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appletData]);

  useEffect(() => {
    setSubjectData(subjectDataProps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appletFormValues,
    appletData,
    includeRespondentId,
    itemValue,
    reportIncludedItemName,
    reportIncludedActivity,
  ]);

  useEffect(() => {
    dispatch(setReportConfigChanges({ hasChanges: isDirty || hasErrors }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, hasErrors]);

  useEffect(() => {
    if (!saveChanges) return;

    handleSaveChanges();
    dispatch(resetReportConfigChanges());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveChanges]);

  useEffect(() => {
    if (!doNotSaveChanges) return;

    handleDontSave();
    dispatch(resetReportConfigChanges());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doNotSaveChanges]);

  if (isActivityOrFlow && !isServerConfigured) {
    return <ServerNotConfigured appletId={appletData?.id ?? ''} data-testid={dataTestid} />;
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <StyledFlexColumn sx={{ maxWidth: '55.7rem' }}>
          <Box>
            <StyledButton
              disableRipple
              onClick={toggleBooleanState(setSettingsOpen)}
              endIcon={
                <StyledSvg>
                  <Svg id={isSettingsOpen ? 'navigate-up' : 'navigate-down'} />
                </StyledSvg>
              }
              data-testid={`${dataTestid}-server-config-collapse`}
            >
              <StyledTitleMedium color={variables.palette.on_surface}>
                {t('serverConfiguration')}
              </StyledTitleMedium>
            </StyledButton>
          </Box>
          <StyledBodyLarge
            sx={{ margin: theme.spacing(2.4, 0, isSettingsOpen ? 2.4 : 4.8) }}
            color={
              isServerConfigured
                ? variables.palette.semantic.green
                : variables.palette.semantic.error
            }
          >
            {t(isServerConfigured ? 'serverStatusConfigured' : 'serverStatusNotConfigured')}
          </StyledBodyLarge>
          {isSettingsOpen && (
            <Box sx={{ mb: theme.spacing(2.4) }}>
              <StyledBodyLarge color={variables.palette.on_surface_variant}>
                <Trans i18nKey="configureServerURL">
                  For Security reasons, you must configure the Server URL (IP Address) and Public
                  Encryption Key to generate and email reports.
                  <StyledLink href={REPORT_SERVER_INSTRUCTIONS_LINK} target="_blank">
                    See here for instructions.
                  </StyledLink>
                  .
                </Trans>
              </StyledBodyLarge>
              <InputController
                control={control}
                name="reportServerIp"
                label={t('serverUrl')}
                sx={{ marginTop: theme.spacing(2.4) }}
                data-testid={`${dataTestid}-server-url`}
              />
              <InputController
                control={control}
                name="reportPublicKey"
                label={t('publicEncryptionKey')}
                sx={{ marginTop: theme.spacing(2.4) }}
                multiline
                rows={TEXTAREA_ROWS_COUNT_SM}
                data-testid={`${dataTestid}-encrypt-key`}
              />
            </Box>
          )}
        </StyledFlexColumn>
        <StyledFlexColumn sx={{ maxWidth: '81.8rem' }}>
          <StyledTitleMedium
            color={variables.palette.on_surface}
            sx={{ marginBottom: theme.spacing(1.2) }}
          >
            {t('sendReportTo')}
          </StyledTitleMedium>
          <TagsController
            name="email"
            control={control}
            tags={reportRecipients}
            onAddTagClick={handleAddEmail}
            onRemoveTagClick={handleRemoveEmail}
            uiType={UiType.Secondary}
            inputLabel={t('addRecipients')}
            disabled={isActivityOrFlow}
            data-testid={`${dataTestid}-recipients`}
          />
          <StyledTitleMedium
            color={variables.palette.on_surface}
            sx={{ m: theme.spacing(4.8, 0, 1.2) }}
          >
            {t('includeInEmail')}
          </StyledTitleMedium>
          <CheckboxController
            control={control}
            sx={{ ml: theme.spacing(1.4) }}
            name="reportIncludeUserId"
            disabled={isActivityOrFlow || undefined}
            label={<StyledBodyLarge>{t('respondentId')}</StyledBodyLarge>}
            data-testid={`${dataTestid}-report-includes-respondent`}
          />
          {isActivityOrFlow && (
            <CheckboxController
              control={control}
              sx={{ ml: theme.spacing(1.4) }}
              name="itemValue"
              label={<StyledBodyLarge>{t('itemValue')}</StyledBodyLarge>}
              onCustomChange={handleChangeItemValue}
              data-testid={`${dataTestid}-item-value`}
            />
          )}
          {itemValue && (
            <StyledActivities>
              {isActivityFlow && (
                <SelectController
                  {...commonSelectProps}
                  name="reportIncludedActivityName"
                  label={t('activity')}
                  options={getActivitiesOptions(activityFlow, appletFormValues)}
                  customChange={handleActivityChange}
                  sx={{ mr: theme.spacing(2.4) }}
                  data-testid={`${dataTestid}-report-includes-activity-name`}
                />
              )}
              <SelectController
                {...commonSelectProps}
                name="reportIncludedItemName"
                label={t('newItem')}
                disabled={isActivityFlow && reportIncludedActivity === ''}
                options={getActivityItemsOptions(activity ?? selectedActivity)}
                sx={{ width: isActivity ? '50%' : '100%' }}
                data-testid={`${dataTestid}-report-includes-item-name`}
              />
            </StyledActivities>
          )}
          <StyledTitleMedium
            color={variables.palette.on_surface}
            sx={{ m: theme.spacing(4.8, 0, 1.2) }}
          >
            {t('subjectPreview')}
          </StyledTitleMedium>
          <InputController
            control={control}
            name="subject"
            sx={{ pointerEvents: 'none', backgroundColor: variables.palette.surface1 }}
            data-testid={`${dataTestid}-subject`}
          />
          <StyledTitleMedium
            color={variables.palette.on_surface}
            sx={{
              m: theme.spacing(4.8, 0, 1.2),
              opacity: isActivityOrFlow ? variables.opacity.disabled : 1,
            }}
          >
            {t('emailBody')}
          </StyledTitleMedium>
          <EditorController
            control={control}
            name="reportEmailBody"
            disabled={isActivityOrFlow}
            data-testid={`${dataTestid}-report-email-body`}
          />
        </StyledFlexColumn>
        <StyledAppletSettingsButton
          variant="outlined"
          type="submit"
          startIcon={<Svg width="18" height="18" id="save" />}
          data-testid={`${dataTestid}-save`}
        >
          {t('save')}
        </StyledAppletSettingsButton>
      </form>
      {passwordPopupVisible && (
        <AppletPasswordPopup
          appletId={appletData?.id ?? ''}
          onClose={() => setPasswordPopupVisible(false)}
          popupType={AppletPasswordPopupType.Enter}
          popupVisible={passwordPopupVisible}
          submitCallback={passwordSubmit}
          encryption={appletData?.encryption}
          data-testid="report-config-password-popup"
        />
      )}
      {warningPopupVisible && (
        <WarningPopup
          popupVisible={warningPopupVisible}
          setPopupVisible={setWarningPopupVisible}
          submitCallback={handleSaveWithoutServer}
        />
      )}
      {verifyPopupVisible && (
        <ServerVerifyErrorPopup
          popupVisible={verifyPopupVisible}
          setPopupVisible={setVerifyPopupVisible}
        />
      )}
      {errorPopupVisible && (
        <ErrorPopup
          popupVisible={errorPopupVisible}
          setPopupVisible={setErrorPopupVisible}
          retryCallback={handleSaveWithoutServer}
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
