import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';

import { postReportConfigApi } from 'api';
import { applet } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { SaveChangesPopup, Svg } from 'shared/components';
import {
  CheckboxController,
  EditorController,
  InputController,
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
} from 'modules/Dashboard/features/Applet';
import { useAsync, useIsServerConfigured } from 'shared/hooks';
import { getParsedEncryptionFromServer, getPrivateKey, publicEncrypt } from 'shared/utils';
import { reportConfig } from 'modules/Builder/state';

import { StyledAppletSettingsButton } from '../AppletSettings.styles';
import { reportConfigSchema } from './ReportConfigSetting.schema';
import { StyledButton, StyledSvg, StyledLink } from './ReportConfigSetting.styles';
import { ReportConfigFormValues, ReportConfigSettingProps } from './ReportConfigSetting.types';
import { ErrorPopup, ServerVerifyErrorPopup, SuccessPopup, WarningPopup } from './Popups';
import { getDefaultValues, setSubjectData } from './ReportConfigSetting.utils';
import { useCheckReportServer } from './ReportConfigSetting.hooks';
import { usePrompt } from '../AppletSettings.hooks';
import { REPORT_SERVER_INSTRUCTIONS_LINK } from './ReportConfigSetting.const';

export const ReportConfigSetting = ({ isDashboard, onSubmitSuccess }: ReportConfigSettingProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { saveChanges, doNotSaveChanges } = reportConfig.useReportConfigChanges() || {};
  const { resetReportConfigChanges, setReportConfigChanges } = reportConfig.actions;
  const isServerConfigured = useIsServerConfigured();

  const [isSettingsOpen, setSettingsOpen] = useState(!isServerConfigured);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);
  const [warningPopupVisible, setWarningPopupVisible] = useState(false);
  const [verifyPopupVisible, setVerifyPopupVisible] = useState(false);

  const { getApplet } = applet.thunk;
  const { updateAppletData } = applet.actions;
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);
  const { accountId = '' } = encryptionInfoFromServer ?? {};

  const { execute: postReportConfig } = useAsync(
    postReportConfigApi,
    () => {
      setSuccessPopupVisible(true);
    },
    () => {
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
    formState: { isDirty, isSubmitted, defaultValues },
    setError,
    clearErrors,
  } = useForm<ReportConfigFormValues>({
    resolver: yupResolver(reportConfigSchema()),
    defaultValues: getDefaultValues(appletData),
    mode: 'onSubmit',
  });

  const { promptVisible, confirmNavigation, cancelNavigation } = usePrompt(isDirty && !isSubmitted);

  const reportRecipients = watch('reportRecipients') || [];
  const includeRespondentId = watch('reportIncludeUserId');
  const reportServerUrl = watch('reportServerIp');
  const reportPublicKey = watch('reportPublicKey');

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
    setValue('reportRecipients', reportRecipients.filter((_, i) => i !== index) as string[]);
  };

  const onSubmit = (values: ReportConfigFormValues) => {
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

    const body = {
      reportServerIp,
      reportPublicKey,
      reportRecipients,
      reportIncludeUserId,
      reportEmailBody,
    };

    await postReportConfig({
      appletId: appletData?.id ?? '',
      ...body,
    });

    if (!isDashboard) dispatch(updateAppletData(body));

    reset(getDefaultValues(body));
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
        publicEncrypt(
          JSON.stringify({
            password,
            privateKey: getPrivateKey({ appletPassword: password, accountId }),
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
    handleSaveReportConfig();
  };

  const passwordSubmit: AppletPasswordPopupProps['submitCallback'] = (passwordRef) => {
    handleSetPassword(passwordRef.current?.password ?? '');
  };

  const handleSaveChanges = () => {
    handleSubmit(onSubmit)();
    dispatch(resetReportConfigChanges());
  };

  const handleSuccessPopupClose = () => {
    setSuccessPopupVisible(false);
    confirmNavigation();
  };

  const handleCancel = () => {
    cancelNavigation();
  };

  const handleDontSave = () => {
    reset(getDefaultValues(appletData));
    dispatch(resetReportConfigChanges());
    confirmNavigation();
  };

  useEffect(() => {
    if (successPopupVisible && isDashboard) {
      dispatch(getApplet({ appletId: appletData?.id ?? '' }));
    }

    if (successPopupVisible && onSubmitSuccess) {
      onSubmitSuccess(getValues());
    }
  }, [successPopupVisible]);

  useEffect(() => {
    reset(getDefaultValues(appletData));
    setSubjectData(setValue, includeRespondentId);
  }, [appletData]);

  useEffect(() => {
    setSubjectData(setValue, includeRespondentId);
  }, [includeRespondentId]);

  useEffect(() => {
    dispatch(setReportConfigChanges({ hasChanges: isDirty && !isSubmitted }));
  }, [isDirty, isSubmitted]);

  useEffect(() => {
    if (!saveChanges) return;

    handleSaveChanges();
  }, [saveChanges]);

  useEffect(() => {
    if (!doNotSaveChanges) return;

    handleDontSave();
  }, [doNotSaveChanges]);

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <StyledFlexColumn sx={{ maxWidth: '55.7rem' }}>
          <Box>
            <StyledButton
              disableRipple
              onClick={() => setSettingsOpen((prevState) => !prevState)}
              endIcon={
                <StyledSvg>
                  <Svg id={isSettingsOpen ? 'navigate-up' : 'navigate-down'} />
                </StyledSvg>
              }
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
              />
              <InputController
                control={control}
                name="reportPublicKey"
                label={t('publicEncryptionKey')}
                sx={{ marginTop: theme.spacing(2.4) }}
                multiline
                rows={4}
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
            label={<StyledBodyLarge>{t('respondentId')}</StyledBodyLarge>}
          />
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
          />
          <StyledTitleMedium
            color={variables.palette.on_surface}
            sx={{ m: theme.spacing(4.8, 0, 1.2) }}
          >
            {t('emailBody')}
          </StyledTitleMedium>
          <EditorController control={control} name="reportEmailBody" />
        </StyledFlexColumn>
        <StyledAppletSettingsButton
          variant="outlined"
          type="submit"
          startIcon={<Svg width="18" height="18" id="save" />}
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
      {successPopupVisible && (
        <SuccessPopup popupVisible={successPopupVisible} onClose={handleSuccessPopupClose} />
      )}
      {promptVisible && (
        <SaveChangesPopup
          popupVisible={promptVisible}
          onDontSave={handleDontSave}
          onCancel={handleCancel}
          onSave={handleSaveChanges}
        />
      )}
    </>
  );
};
