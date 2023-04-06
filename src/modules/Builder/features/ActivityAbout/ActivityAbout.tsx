import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { CheckboxController, InputController } from 'shared/components/FormComponents';
import {
  StyledHeadlineLarge,
  StyledBuilderWrapper,
  StyledBodyLarge,
  StyledTitleMedium,
  theme,
  variables,
  StyledFlexColumn,
} from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';
import { Svg, Tooltip, Uploader } from 'shared/components';
import { MAX_DESCRIPTION_LENGTH_LONG, MAX_FILE_SIZE_1GB, MAX_NAME_LENGTH } from 'shared/consts';
import { byteFormatter } from 'shared/utils';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';

import { Uploads } from '../../components';
import { StyledContainer, StyledSvg } from './ActivityAbout.styles';

export const ActivityAbout = () => {
  const { t } = useTranslation();

  useBreadcrumbs([
    {
      icon: <Svg id="more-info-outlined" width="18" height="18" />,
      label: t('aboutActivity'),
    },
  ]);

  const { control, setValue, watch } = useFormContext();

  const { name } = useCurrentActivity();

  const commonProps = {
    control,
    fullWidth: true,
  };

  const commonUploaderProps = {
    width: 20,
    height: 20,
    maxFileSize: MAX_FILE_SIZE_1GB,
  };

  const uploads = [
    {
      title: t('activityImg'),
      tooltipTitle: t('activityImageDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue(`${name}.image`, val)}
          getValue={() => watch(`${name}.image`)}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_1GB) })}
        />
      ),
    },
    {
      title: t('activityWatermark'),
      tooltipTitle: t('activitySplashScreenDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue(`${name}.splashScreen`, val)}
          getValue={() => watch(`${name}.splashScreen`)}
          description={t('uploadTransfluent', { size: byteFormatter(MAX_FILE_SIZE_1GB) })}
        />
      ),
    },
  ];

  const checkboxes = [
    {
      name: `${name}.showAllAtOnce`,
      label: (
        <StyledBodyLarge sx={{ position: 'relative' }}>
          {t('showAllQuestionsAtOnce')}
          <Tooltip tooltipTitle={t('webAppOnlyFeature')}>
            <span>
              <StyledSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledBodyLarge>
      ),
    },
    {
      name: `${name}.isSkippable`,
      label: <StyledBodyLarge>{t('allowToSkipAllItems')}</StyledBodyLarge>,
    },
    {
      name: `${name}.responseIsEditable`,
      label: <StyledBodyLarge>{t('disableAbilityToChangeResponse')}</StyledBodyLarge>,
    },
    {
      name: `${name}.isReviewable`,
      label: (
        <StyledBodyLarge>
          {t('onlyAdminPanelActivity')}
          <Tooltip tooltipTitle={t('webAppOnlyFeatureTooltip')}>
            <span>
              <StyledSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledBodyLarge>
      ),
    },
  ];

  return (
    <StyledBuilderWrapper>
      <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(4) }}>
        {t('aboutActivity')}
      </StyledHeadlineLarge>
      <StyledFlexColumn>
        <Box sx={{ display: 'flex' }}>
          <StyledContainer>
            <Box sx={{ marginBottom: theme.spacing(4.4) }}>
              <InputController
                {...commonProps}
                name={`${name}.name`}
                maxLength={MAX_NAME_LENGTH}
                label={t('activityName')}
              />
            </Box>
            <InputController
              {...commonProps}
              name={`${name}.description`}
              maxLength={MAX_DESCRIPTION_LENGTH_LONG}
              label={t('activityDescription')}
              multiline
              rows={4}
            />
          </StyledContainer>
          <Uploads uploads={uploads} />
        </Box>
        <StyledTitleMedium color={variables.palette.on_surface_variant} sx={{ marginBottom: 1.6 }}>
          {t('itemLevelSettings')}
        </StyledTitleMedium>
        <StyledFlexColumn>
          {checkboxes.map(({ name, label }) => (
            <CheckboxController key={name} control={control} name={name} label={label} />
          ))}
        </StyledFlexColumn>
      </StyledFlexColumn>
    </StyledBuilderWrapper>
  );
};
