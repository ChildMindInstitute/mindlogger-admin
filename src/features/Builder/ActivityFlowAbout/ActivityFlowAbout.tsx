import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import { CheckboxController, InputController } from 'components/FormComponents';
import { StyledBodyLarge, StyledHeadlineLarge, StyledTitleMedium } from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { useBreadcrumbs } from 'hooks';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from 'consts';

import { StyledForm, StyledSettings, StyledSvg } from './ActivityFlow.styles';

export const ActivityFlowAbout = () => {
  const { t } = useTranslation();
  const { control } = useForm();

  useBreadcrumbs([
    {
      icon: <Svg id="more-info-outlined" width="18" height="18" />,
      label: t('aboutActivityFlow'),
    },
  ]);

  const commonProps = {
    fullWidth: true,
    control,
    sx: { marginBottom: theme.spacing(4.4) },
  };

  return (
    <>
      <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(4) }}>
        {t('aboutActivityFlow')}
      </StyledHeadlineLarge>
      <StyledForm noValidate>
        <InputController
          {...commonProps}
          name="activityFlowName"
          label={t('activityFlowName')}
          maxLength={MAX_NAME_LENGTH}
        />
        <InputController
          {...commonProps}
          name="activityFlowDescription"
          label={t('activityFlowDescription')}
          maxLength={MAX_DESCRIPTION_LENGTH}
        />
        <StyledTitleMedium
          color={variables.palette.on_surface_variant}
          sx={{ marginBottom: theme.spacing(2.4) }}
        >
          {t('additionalSettings')}
        </StyledTitleMedium>
        <StyledSettings>
          <CheckboxController
            control={control}
            name="combineReports"
            label={<StyledBodyLarge>{t('combineReportsIntoSingleFile')}</StyledBodyLarge>}
          />
          <CheckboxController
            control={control}
            name="hideBadge"
            label={
              <StyledBodyLarge sx={{ position: 'relative' }}>
                {t('hideBadge')}
                <StyledSvg id="more-info-outlined" />
              </StyledBodyLarge>
            }
          />
        </StyledSettings>
      </StyledForm>
    </>
  );
};
