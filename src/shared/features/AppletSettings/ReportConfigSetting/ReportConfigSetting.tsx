import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { folders } from 'redux/modules';
import { SaveChangesPopup, Svg } from 'shared/components';
import {
  CheckboxController,
  EditorController,
  InputController,
  TagsController,
  UiType,
} from 'shared/components/FormComponents';
import { theme, variables, StyledBodyLarge, StyledTitleMedium } from 'shared/styles';
import { AppletPasswordPopup, AppletPasswordPopupType } from 'modules/Dashboard/features/Applet';

import { StyledAppletSettingsButton, StyledHeadline } from '../AppletSettings.styles';
import { defaultValues as defaultFormValues } from './ReportConfigSetting.const';
import { reportConfigSchema } from './ReportConfigSetting.schema';
import { StyledButton, StyledSvg, StyledContainer, StyledForm } from './ReportConfigSetting.styles';
import { FormValues } from './ReportConfigSetting.types';
import { ErrorPopup, ServerVerifyErrorPopup, SuccessPopup, WarningPopup } from './Popups';
import { usePrompt } from './ReportConfigSetting.hooks';

export const ReportConfigSetting = () => {
  const { appletId: id } = useParams();
  const applet = id ? folders.useApplet(id) : undefined;
  const { t } = useTranslation();
  const isServerConfigured = false; // TODO: add server configured functionality when the back-end is ready
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);
  const [serverVerifyErrorPopupVisible, setServerVerifyErrorPopupVisible] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);
  const [warningPopupVisible, setWarningPopupVisible] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    reset,
    formState: { isDirty, isSubmitted, defaultValues },
  } = useForm<FormValues>({
    resolver: yupResolver(reportConfigSchema()),
    defaultValues: defaultFormValues,
    mode: 'onSubmit',
  });

  const { promptVisible, confirmNavigation, cancelNavigation } = usePrompt(isDirty && !isSubmitted);

  const emailRecipients = watch('emailRecipients');
  const respondentId = watch('respondentId');
  const caseId = watch('caseId');

  const handleAddEmail = async (value: string) => {
    const isValid = await trigger(['email']);
    if (!isValid) return;

    if (value.length) {
      setValue('email', '');
      if (!emailRecipients.some((item) => item === value)) {
        setValue('emailRecipients', [...emailRecipients, value]);
      }
    }
  };

  const handleRemoveEmail = (index: number) => {
    setValue('emailRecipients', emailRecipients.filter((_, i) => i !== index) as string[]);
  };

  const onSubmit = (values: FormValues) => {
    const { serverURL, publicEncryptionKey } = values;
    if (!serverURL || !publicEncryptionKey) {
      return setWarningPopupVisible(true);
    }

    if (
      serverURL !== defaultValues?.serverURL ||
      publicEncryptionKey !== defaultValues?.publicEncryptionKey
    ) {
      setPasswordPopupVisible(true);
    }
  };

  const saveReportConfigurations = () => {
    // TODO: make a request and depending on a response, show the corresponding popup
    setSuccessPopupVisible(true);
    reset({}, { keepValues: true });
  };

  const passwordSubmit = () => {
    saveReportConfigurations();
    setPasswordPopupVisible(false);
  };

  const handleSaveChanges = () => {
    cancelNavigation();
    handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    cancelNavigation();
  };

  useEffect(() => {
    let subject = 'REPORT';
    if (respondentId) {
      subject += ' by user123';
    }
    if (caseId) {
      subject += ' about case123';
    }
    subject += `: ${applet?.name || 'Example applet'} /activity123 or activityflow123`; // TODO will be fixed for activities
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
            tags={emailRecipients}
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
            name="respondentId"
            label={<StyledBodyLarge>{t('respondentId')}</StyledBodyLarge>}
          />
          {/* Case ID should be hidden on UI until Cases functionality is implemented. */}
          {/* <CheckboxController
          control={control}
          sx={{ marginLeft: theme.spacing(1.4) }}
          name="caseId"
          label={<StyledBodyLarge>{t('caseId')}</StyledBodyLarge>}
        /> */}
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
        <EditorController control={control} name="description" />
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
                name="serverURL"
                label={t('serverUrl')}
                sx={{ marginTop: theme.spacing(2.4) }}
              />
              <InputController
                control={control}
                name="publicEncryptionKey"
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
          appletId={id ?? ''}
          onClose={() => setPasswordPopupVisible(false)}
          popupType={AppletPasswordPopupType.Enter}
          popupVisible={passwordPopupVisible}
          submitCallback={passwordSubmit}
        />
      )}
      {warningPopupVisible && (
        <WarningPopup
          popupVisible={warningPopupVisible}
          setPopupVisible={setWarningPopupVisible}
          submitCallback={saveReportConfigurations}
        />
      )}
      {serverVerifyErrorPopupVisible && (
        <ServerVerifyErrorPopup
          popupVisible={serverVerifyErrorPopupVisible}
          setPopupVisible={setServerVerifyErrorPopupVisible}
        />
      )}
      {errorPopupVisible && (
        <ErrorPopup
          popupVisible={errorPopupVisible}
          setPopupVisible={setErrorPopupVisible}
          retryCallback={saveReportConfigurations}
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
