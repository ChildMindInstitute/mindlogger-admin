import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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
import { theme, variables, StyledBodyLarge, StyledTitleMedium } from 'shared/styles';
import {
  AppletPasswordPopup,
  AppletPasswordPopupType,
  AppletPasswordPopupProps,
} from 'modules/Dashboard/features/Applet';
import { useAsync, useIsServerConfigured } from 'shared/hooks';
import { getParsedEncryptionFromServer, getPrivateKey, publicEncrypt } from 'shared/utils';

import { StyledAppletSettingsButton, StyledHeadline } from '../AppletSettings.styles';
import { reportConfigSchema } from './ReportConfigSetting.schema';
import { StyledButton, StyledSvg, StyledContainer, StyledForm } from './ReportConfigSetting.styles';
import { ReportConfigFormValues, ReportConfigSettingProps } from './ReportConfigSetting.types';
import { ErrorPopup, ServerVerifyErrorPopup, SuccessPopup, WarningPopup } from './Popups';
import { getDefaultValues } from './ReportConfigSetting.utils';
import { useCheckReportServer } from './ReportConfigSetting.hooks';
import { usePrompt } from '../AppletSettings.hooks';

export const ReportConfigSetting = ({ isDashboard, onSubmitSuccess }: ReportConfigSettingProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};

  const [isSettingsOpen, setSettingsOpen] = useState(false);
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
  } = useForm<ReportConfigFormValues>({
    resolver: yupResolver(reportConfigSchema()),
    defaultValues: getDefaultValues(appletData),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (successPopupVisible && isDashboard) {
      dispatch(getApplet({ appletId: appletData?.id ?? '' }));
    }

    if (successPopupVisible && onSubmitSuccess) {
      onSubmitSuccess(getValues());
    }
  }, [successPopupVisible]);

  useEffect(() => {
    reset(appletData);
  }, [appletData]);

  const { promptVisible, confirmNavigation, cancelNavigation } = usePrompt(isDirty && !isSubmitted);

  const reportRecipients = watch('reportRecipients') || [];
  const respondentId = watch('reportIncludeUserId');
  const caseId = watch('reportIncludeCaseId');
  const reportServerUrl = watch('reportServerIp');
  const reportPublicKey = watch('reportPublicKey');

  const isServerConfigured = useIsServerConfigured();

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
      reportIncludeCaseId,
      reportEmailBody,
    } = getValues() ?? {};

    const body = {
      reportServerIp,
      reportPublicKey,
      reportRecipients,
      reportIncludeUserId,
      reportIncludeCaseId,
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

    if (isVerified) return setPasswordPopupVisible(true);

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

  const passwordSubmit: AppletPasswordPopupProps['submitCallback'] = (_, passwordRef) => {
    handleSetPassword(passwordRef.current?.password ?? '');
  };

  const handleSaveChanges = () => {
    handleSubmit(onSubmit)();
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
    confirmNavigation();
  };

  useEffect(() => {
    let subject = 'REPORT';
    if (respondentId) {
      subject += ' by [Respondent ID]';
    }
    if (caseId) {
      subject += ' about [Case ID]';
    }
    subject += ': [Applet Name] / [Activity Name]';
    setValue('subject', subject);
  }, [respondentId, caseId]);

  return (
    <>
      <StyledForm noValidate onSubmit={handleSubmit(onSubmit)}>
        <StyledHeadline sx={{ marginRight: theme.spacing(2.4) }}>
          {t('reportConfiguration')}
        </StyledHeadline>
        <StyledContainer>
          <StyledTitleMedium sx={{ marginBottom: theme.spacing(2.4) }}>
            {t('emailConfiguration')}
          </StyledTitleMedium>
          <TagsController
            name="email"
            control={control}
            label={t('recipients')}
            tags={reportRecipients}
            onAddTagClick={handleAddEmail}
            onRemoveTagClick={handleRemoveEmail}
            uiType={UiType.Secondary}
            helperText={t('enterRecipientsEmails')}
          />
          <StyledTitleMedium sx={{ margin: theme.spacing(4.8, 0, 1.2) }}>
            {t('includeInEmail')}
          </StyledTitleMedium>
          <CheckboxController
            control={control}
            sx={{ marginLeft: theme.spacing(1.4) }}
            name="reportIncludeUserId"
            label={<StyledBodyLarge>{t('respondentId')}</StyledBodyLarge>}
          />
          <CheckboxController
            control={control}
            sx={{ marginLeft: theme.spacing(1.4) }}
            name="reportIncludeCaseId"
            label={<StyledBodyLarge>{t('caseId')}</StyledBodyLarge>}
          />
          <InputController
            inputProps={{ readOnly: true, className: 'read-only' }}
            control={control}
            name="subject"
            label={t('subjectPreview')}
            multiline
            rows={2}
            sx={{ margin: theme.spacing(4.8, 0) }}
          />
        </StyledContainer>
        <EditorController control={control} name="reportEmailBody" />
        <StyledContainer>
          <StyledButton
            disableRipple
            onClick={() => setSettingsOpen((prevState) => !prevState)}
            endIcon={
              <StyledSvg>
                <Svg id={isSettingsOpen ? 'navigate-up' : 'navigate-down'} />
              </StyledSvg>
            }
          >
            <StyledTitleMedium>{t('advancedSettings')}</StyledTitleMedium>
          </StyledButton>
          {isSettingsOpen && (
            <>
              <StyledBodyLarge
                color={variables.palette.on_surface_variant}
                sx={{ marginTop: theme.spacing(2.4) }}
              >
                {t('configureServerURL')}
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
            </>
          )}
          <StyledBodyLarge
            sx={{ margin: theme.spacing(2.4, 0, 3.2) }}
            color={
              isServerConfigured
                ? variables.palette.semantic.green
                : variables.palette.semantic.error
            }
          >
            {t(isServerConfigured ? 'serverStatusConfigured' : 'serverStatusNotConfigured')}
          </StyledBodyLarge>
        </StyledContainer>
        <StyledAppletSettingsButton
          variant="outlined"
          type="submit"
          startIcon={<Svg width="18" height="18" id="save" />}
        >
          {t('save')}
        </StyledAppletSettingsButton>
      </StyledForm>
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
