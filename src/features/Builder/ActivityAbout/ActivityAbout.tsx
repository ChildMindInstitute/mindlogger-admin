import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';

import { CheckboxController, InputController } from 'components/FormComponents';
import {
  StyledHeadlineLarge,
  StyledBuilderWrapper,
  StyledBodyLarge,
  StyledTitleMedium,
} from 'styles/styledComponents';
import { useBreadcrumbs } from 'hooks';
import { Svg, Tooltip, Uploader, BuilderUploads } from 'components';
import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { MAX_DESCRIPTION_LENGTH_LONG, MAX_NAME_LENGTH } from 'consts';

import { StyledForm, StyledContainer, StyledSvg, StyledSettings } from './ActivityAbout.styles';
import { defaultValues } from './ActivityAbout.const';
import { ActivityAboutSchema } from './ActivityAbout.schema';
import { FormValues } from './ActivityAbout.types';

export const ActivityAbout = () => {
  const { t } = useTranslation();
  const mockedTooltipText = 'Lorem ipsum';

  useBreadcrumbs([
    {
      icon: <Svg id="more-info-outlined" width="18" height="18" />,
      label: t('aboutActivity'),
    },
  ]);

  const { control, setValue, watch } = useForm<FormValues>({
    resolver: yupResolver(ActivityAboutSchema()),
    defaultValues,
    mode: 'onChange',
  });

  const commonProps = {
    control,
    fullWidth: true,
  };

  const commonUploaderProps = {
    width: 20,
    height: 20,
  };

  const uploads = [
    {
      title: t('activityImg'),
      tooltipTitle: mockedTooltipText,
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue('activityImg', val)}
          getValue={() => watch('activityImg')}
          description={t('uploadImg')}
        />
      ),
    },
    {
      title: t('activityWatermark'),
      tooltipTitle: mockedTooltipText,
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue('activityWatermark', val)}
          getValue={() => watch('activityWatermark')}
          description={t('uploadTransfluent')}
        />
      ),
    },
  ];

  const checkboxes = [
    {
      name: 'showAllQuestionsAtOnce',
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
      name: 'allowToSkipAllItems',
      label: <StyledBodyLarge>{t('allowToSkipAllItems')}</StyledBodyLarge>,
    },
    {
      name: 'disableAbilityToChangeResponse',
      label: <StyledBodyLarge>{t('disableAbilityToChangeResponse')}</StyledBodyLarge>,
    },
    {
      name: 'onlyAdminPanelActivity',
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
      <StyledForm noValidate>
        <Box sx={{ display: 'flex' }}>
          <StyledContainer>
            <Box sx={{ marginBottom: theme.spacing(4.4) }}>
              <InputController
                {...commonProps}
                name="activityName"
                maxLength={MAX_NAME_LENGTH}
                label={t('activityName')}
              />
            </Box>
            <InputController
              {...commonProps}
              name="activityDescription"
              maxLength={MAX_DESCRIPTION_LENGTH_LONG}
              label={t('activityDescription')}
              multiline
              rows={4}
            />
          </StyledContainer>
          <BuilderUploads uploads={uploads} />
        </Box>
        <StyledTitleMedium color={variables.palette.on_surface_variant} sx={{ marginBottom: 1.6 }}>
          {t('itemLevelSettings')}
        </StyledTitleMedium>
        <StyledSettings>
          {checkboxes.map(({ name, label }) => (
            <CheckboxController
              key={name}
              control={control}
              name={name as keyof FormValues}
              label={label}
            />
          ))}
        </StyledSettings>
      </StyledForm>
    </StyledBuilderWrapper>
  );
};
