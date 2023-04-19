import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { CheckboxController, InputController } from 'shared/components/FormComponents';
import {
  StyledBodyLarge,
  StyledTitleMedium,
  theme,
  variables,
  StyledFlexColumn,
} from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';
import { Tooltip, Uploader } from 'shared/components';
import {
  ItemResponseType,
  MAX_DESCRIPTION_LENGTH,
  MAX_FILE_SIZE_1GB,
  MAX_NAME_LENGTH,
} from 'shared/consts';
import { byteFormatter } from 'shared/utils';
import { BuilderContainer } from 'shared/features';
import { ActivityFormValues, ItemFormValues } from 'modules/Builder/pages/BuilderApplet';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';

import { Uploads } from '../../components';
import { StyledContainer, StyledSvg } from './ActivityAbout.styles';

export const ActivityAbout = () => {
  const { t } = useTranslation();

  useBreadcrumbs([
    {
      icon: 'more-info-outlined',
      label: t('aboutActivity'),
    },
  ]);

  const { control, setValue, watch } = useFormContext();
  const { name } = useCurrentActivity();

  const activities = watch('activities');
  const activityItems = watch(`${name}.items`);
  const activityWithReviewable = activities?.find((activity: ActivityFormValues, index: number) => {
    const activityName = `activities.${index}`;

    if (name === activityName) return false;

    return activity.isReviewable;
  });
  const hasUnsupportedReviewableItemTypes = activityItems?.some(
    (item: ItemFormValues) =>
      ![
        ItemResponseType.SingleSelection,
        ItemResponseType.MultipleSelection,
        ItemResponseType.Slider,
        '',
      ].includes(item.responseType as ItemResponseType),
  );
  const isReviewableExistsTooltip = activityWithReviewable
    ? t('isReviewableExists', { activityName: activityWithReviewable?.name })
    : undefined;
  const isReviewableUnsupportedTooltip = hasUnsupportedReviewableItemTypes
    ? t('isReviewableUnsupported')
    : undefined;

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
      title: t('activitySplashscreen'),
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
      label: <StyledBodyLarge>{t('showAllQuestionsAtOnce')}</StyledBodyLarge>,
    },
    {
      name: `${name}.isSkippable`,
      label: <StyledBodyLarge>{t('allowToSkipAllItems')}</StyledBodyLarge>,
    },
    {
      name: `${name}.responseIsEditable`,
      label: <StyledBodyLarge>{t('disableAbilityToChangeResponse')}</StyledBodyLarge>,
      isInversed: true,
    },
    {
      name: `${name}.isReviewable`,
      disabled: hasUnsupportedReviewableItemTypes || activityWithReviewable,
      label: (
        <StyledBodyLarge sx={{ position: 'relative' }}>
          <Tooltip tooltipTitle={isReviewableExistsTooltip || isReviewableUnsupportedTooltip}>
            <span>{t('onlyAdminPanelActivity')}</span>
          </Tooltip>
          <Tooltip tooltipTitle={t('onlyAdminPanelActivityTooltip')}>
            <span>
              <StyledSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledBodyLarge>
      ),
    },
  ];

  return (
    <BuilderContainer title={t('aboutActivity')}>
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
            maxLength={MAX_DESCRIPTION_LENGTH}
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
        {checkboxes.map(({ name, label, isInversed, disabled }) => (
          <CheckboxController
            key={name}
            control={control}
            name={name}
            label={label}
            disabled={disabled}
            isInversed={isInversed}
          />
        ))}
      </StyledFlexColumn>
    </BuilderContainer>
  );
};
