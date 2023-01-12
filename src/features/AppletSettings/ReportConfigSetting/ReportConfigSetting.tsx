import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { CheckboxController, EditorController, InputController } from 'components/FormComponents';
import { StyledBodyLarge, StyledTitleMedium } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { Svg } from 'components';
import { variables } from 'styles/variables';

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
  const isServerConfigured = false;
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(reportConfigSchema()),
    defaultValues,
    mode: 'onChange',
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onSubmit = (values: FormValues) => {};

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
        <InputController
          name="email"
          control={control}
          label={t('respondent')}
          placeholder={t('respondent')}
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
          maxRows={4}
          sx={{ margin: theme.spacing(4.8, 0) }}
        />
      </StyledContainer>

      <EditorController control={control} name="description" />

      <StyledContainer>
        <StyledButton
          onClick={() => setSettingsOpen((prevState) => !prevState)}
          endIcon={isSettingsOpen ? <Svg id="arrow-up" /> : <Svg id="arrow-down" />}
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
                  placeholder={t('serverUrl')}
                  sx={{ marginTop: theme.spacing(2.4) }}
                />
                <InputController
                  control={control}
                  name="appletDescription"
                  label={t('appletDescription')}
                  placeholder={t('appletDescription')}
                  sx={{ marginTop: theme.spacing(2.4) }}
                  multiline
                  maxRows={4}
                />
              </>
            )}
          </>
        )}
      </StyledContainer>
    </StyledForm>
  );
};
