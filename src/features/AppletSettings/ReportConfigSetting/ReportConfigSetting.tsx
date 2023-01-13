import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

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
import {
  StyledButton,
  StyledContainer,
  StyledForm,
  StyledHeader,
} from './ReportConfigSetting.styles';
import { FormValues } from './ReportConfigSetting.types';

export const ReportConfigSetting = () => {
  const { t } = useTranslation();
  const isServerConfigured = false; // TODO: add server configured functionality when the back-end is ready
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(reportConfigSchema()),
    defaultValues,
    mode: 'onChange',
  });
  const emails = watch('emails');

  const handleAddEmail = (value: string) => {
    if (value.length) {
      setValue('email', '');
      if (!emails.some((item) => item === value)) {
        setValue('emails', [...emails, value]);
      }
    }
  };

  const handleRemoveEmail = (index: number) => {
    setValue('emails', emails.filter((_, i) => i !== index) as string[]);
  };

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <StyledForm noValidate onSubmit={handleSubmit(onSubmit)}>
      <StyledHeader>
        <StyledHeadline sx={{ marginRight: theme.spacing(2.4) }}>
          {t('reportConfiguration')}
        </StyledHeadline>
        <StyledAppletSettingsButton
          variant="outlined"
          type="submit"
          disabled={!isValid}
          startIcon={<Svg width="19" height="18" id="save" />}
        >
          {t('save')}
        </StyledAppletSettingsButton>
      </StyledHeader>
      <StyledContainer>
        <StyledTitleMedium sx={{ marginBottom: theme.spacing(2.4) }}>
          {t('emailConfiguration')}
        </StyledTitleMedium>
        <TagsController
          name="email"
          control={control}
          label={t('recipient')}
          tags={emails}
          onAddTagClick={handleAddEmail}
          onRemoveTagClick={handleRemoveEmail}
          uiType={UiType.secondary}
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
          control={control}
          name="subject"
          label={t('subjectPreview')}
          placeholder={t('subjectPreviewText')}
          multiline
          rows={2}
          sx={{ margin: theme.spacing(4.8, 0) }}
        />
      </StyledContainer>
      <EditorController control={control} name="description" />
      <StyledContainer>
        <StyledButton
          onClick={() => setSettingsOpen((prevState) => !prevState)}
          endIcon={
            <Svg id={isSettingsOpen ? 'navigate-up' : 'navigate-down'} height="6" width="10" />
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
    </StyledForm>
  );
};
