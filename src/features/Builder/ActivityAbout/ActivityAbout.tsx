import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { CheckboxController, InputController } from 'components/FormComponents';
import {
  StyledFlexTopCenter,
  StyledBodyMedium,
  StyledHeadlineLarge,
  StyledBuilderWrapper,
  StyledBodyLarge,
  StyledTitleMedium,
} from 'styles/styledComponents';
import { useBreadcrumbs } from 'hooks';
import { Svg, Tooltip, Uploader } from 'components';
import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { MAX_DESCRIPTION_LENGTH_LONG, MAX_NAME_LENGTH } from 'consts';

import {
  StyledForm,
  StyledContainer,
  StyledUploadImg,
  StyledUploadImgs,
  StyledSvg,
  StyledTitle,
  StyledSettings,
} from './ActivityAbout.styles';
import { defaultValues } from './ActivityAbout.const';
import { ActivityAboutSchema } from './ActivityAbout.schema';

export const ActivityAbout = () => {
  const { t } = useTranslation();
  const mockedTooltipText = 'Lorem ipsum';

  useBreadcrumbs([
    {
      icon: <Svg id="more-info-outlined" width="18" height="18" />,
      label: t('aboutActivity'),
    },
  ]);

  const { control } = useForm({
    resolver: yupResolver(ActivityAboutSchema()),
    defaultValues,
    mode: 'onChange',
  });

  const commonProps = {
    control,
    fullWidth: true,
  };

  return (
    <StyledBuilderWrapper>
      <StyledHeadlineLarge>{t('aboutActivity')}</StyledHeadlineLarge>
      <StyledForm noValidate>
        <StyledFlexTopCenter>
          <StyledContainer>
            <InputController
              {...commonProps}
              name="activityName"
              maxLength={MAX_NAME_LENGTH}
              label={t('activityName')}
              sx={{ marginBottom: theme.spacing(4.4) }}
            />
            <InputController
              {...commonProps}
              name="activityDescription"
              maxLength={MAX_DESCRIPTION_LENGTH_LONG}
              label={t('activityDescription')}
              sx={{ marginBottom: theme.spacing(4.4) }}
              multiline
              rows={3}
            />
          </StyledContainer>
          <StyledUploadImgs>
            <StyledUploadImg>
              <StyledTitle>
                {t('activityImg')}
                <Tooltip tooltipTitle={mockedTooltipText}>
                  <span>
                    <StyledSvg id="more-info-outlined" />
                  </span>
                </Tooltip>
              </StyledTitle>
              <Uploader width={20} height={20} />
              <StyledBodyMedium
                color={variables.palette.on_surface_variant}
                sx={{ marginTop: theme.spacing(1.6) }}
              >
                {t('uploadImg')}
              </StyledBodyMedium>
            </StyledUploadImg>
            <StyledUploadImg>
              <StyledTitle>
                {t('activityWatermark')}
                <Tooltip tooltipTitle={mockedTooltipText}>
                  <span>
                    <StyledSvg id="more-info-outlined" />
                  </span>
                </Tooltip>
              </StyledTitle>
              <Uploader width={20} height={20} />
              <StyledBodyMedium
                color={variables.palette.on_surface_variant}
                sx={{ marginTop: theme.spacing(1.6) }}
              >
                {t('uploadImg')}
              </StyledBodyMedium>
            </StyledUploadImg>
          </StyledUploadImgs>
        </StyledFlexTopCenter>
        <StyledTitleMedium color={variables.palette.on_surface_variant}>
          {t('itemLevelSettings')}
        </StyledTitleMedium>
        <StyledSettings>
          <CheckboxController
            control={control}
            name="showAllQuestionsAtOnce"
            label={
              <StyledBodyLarge sx={{ position: 'relative' }}>
                {t('showAllQuestionsAtOnce')}
                <Tooltip tooltipTitle={t('webAppOnlyFeature')}>
                  <span>
                    <StyledSvg id="more-info-outlined" />
                  </span>
                </Tooltip>
              </StyledBodyLarge>
            }
          />
          <CheckboxController
            control={control}
            name="allowToSkipAllItems"
            label={<StyledBodyLarge>{t('allowToSkipAllItems')}</StyledBodyLarge>}
          />
          <CheckboxController
            control={control}
            name="disableAbilityToChangeResponse"
            label={<StyledBodyLarge>{t('disableAbilityToChangeResponse')}</StyledBodyLarge>}
          />
          <CheckboxController
            control={control}
            name="onlyAdminPanelActivity"
            label={
              <StyledBodyLarge>
                {t('onlyAdminPanelActivity')}
                <Tooltip tooltipTitle={t('webAppOnlyFeatureTooltip')}>
                  <span>
                    <StyledSvg id="more-info-outlined" />
                  </span>
                </Tooltip>
              </StyledBodyLarge>
            }
          />
        </StyledSettings>
      </StyledForm>
    </StyledBuilderWrapper>
  );
};
