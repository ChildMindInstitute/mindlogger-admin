import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { folders } from 'redux/modules';
import {
  CheckboxController,
  EditorController,
  InputController,
  TagsController,
} from 'components/FormComponents';
import { StyledBodyLarge, StyledTitleMedium } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { Svg } from 'components';
import { variables } from 'styles/variables';
import { UiType } from 'components/FormComponents/TagsController';

import { StyledAppletSettingsButton, StyledHeadline } from '../AppletSettings.styles';
import { defaultValues } from './ReportConfigSetting.const';
import { reportConfigSchema } from './ReportConfigSetting.schema';
import { StyledButton, StyledSvg, StyledContainer, StyledForm } from './ReportConfigSetting.styles';
import { FormValues } from './ReportConfigSetting.types';

export const ReportConfigSetting = () => {
  const { id } = useParams();
  const applet = folders.useApplet(id as string);
  const { t } = useTranslation();
  const isServerConfigured = false; // TODO: add server configured functionality when the back-end is ready
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { handleSubmit, control, setValue, watch, trigger } = useForm<FormValues>({
    resolver: yupResolver(reportConfigSchema()),
    defaultValues,
    mode: 'onSubmit',
  });
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
    console.log(values);
  };

  useEffect(() => {
    let subject = 'REPORT';
    if (respondentId) {
      subject += ' by user123';
    }
    if (caseId) {
      subject += ' about case123';
    }
    subject += `: ${applet.name || 'Example applet'} /activity123 or activityflow123`; // TODO will be fixed for activities
    setValue('subject', subject);
  }, [respondentId, caseId]);

  return (
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
        <CheckboxController
          control={control}
          sx={{ marginLeft: theme.spacing(1.4) }}
          name="caseId"
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
            {isServerConfigured ? (
              <StyledBodyLarge color={variables.palette.semantic.green}>
                {t('serverStatusConfigured')}
              </StyledBodyLarge>
            ) : (
              <>
                <StyledBodyLarge color={variables.palette.semantic.error}>
                  {t('serverStatusNotConfigured')}
                </StyledBodyLarge>
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
                  name="appletDescription"
                  label={t('appletDescription')}
                  sx={{ marginTop: theme.spacing(2.4), minHeight: '16rem' }}
                  multiline
                  rows={4}
                />
              </>
            )}
          </>
        )}
      </StyledContainer>
      <StyledAppletSettingsButton
        variant="outlined"
        type="submit"
        startIcon={<Svg width="18" height="18" id="save" />}
      >
        {t('save')}
      </StyledAppletSettingsButton>
    </StyledForm>
  );
};
