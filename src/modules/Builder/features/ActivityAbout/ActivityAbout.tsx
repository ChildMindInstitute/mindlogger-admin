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
  StyledCheckboxTooltipSvg,
} from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';
import { Tooltip, Uploader } from 'shared/components';
import {
  ItemResponseType,
  MAX_DESCRIPTION_LENGTH,
  MAX_FILE_SIZE_5MB,
  MAX_NAME_LENGTH,
} from 'shared/consts';
import { byteFormatter } from 'shared/utils';
import { BuilderContainer } from 'shared/features';
import { ActivityFormValues, ItemFormValues } from 'modules/Builder/pages/BuilderApplet';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { Uploads } from '../../components';
import { StyledContainer } from './ActivityAbout.styles';
import { itemsForReviewableActivity } from './ActivityAbout.const';

export const ActivityAbout = () => {
  const { t } = useTranslation();

  useBreadcrumbs();

  const { control, setValue, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();

  const activities = watch('activities');
  const activityItems = watch(`${fieldName}.items`);
  const activityWithReviewable = activities?.find((activity: ActivityFormValues, index: number) => {
    const activityFieldName = `activities.${index}`;

    if (fieldName === activityFieldName) return false;

    return activity.isReviewable;
  });
  const hasUnsupportedReviewableItemTypes = activityItems?.some(
    (item: ItemFormValues) =>
      ![...itemsForReviewableActivity, ''].includes(item.responseType as ItemResponseType),
  );
  const isReviewableExistsTooltip = activityWithReviewable
    ? t('isReviewableExists', { activityName: activityWithReviewable?.name })
    : null;
  const isReviewableUnsupportedTooltip = hasUnsupportedReviewableItemTypes
    ? t('isReviewableUnsupported')
    : null;

  const commonProps = {
    control,
    fullWidth: true,
  };

  const commonUploaderProps = {
    width: 20,
    height: 20,
    maxFileSize: MAX_FILE_SIZE_5MB,
  };

  const uploads = [
    {
      title: t('activityImg'),
      tooltipTitle: t('activityImageDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue(`${fieldName}.image`, val)}
          getValue={() => watch(`${fieldName}.image`)}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_5MB) })}
          hasRemoveConfirmation
        />
      ),
    },
    {
      title: t('activitySplashscreen'),
      tooltipTitle: t('activitySplashScreenDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue(`${fieldName}.splashScreen`, val)}
          getValue={() => watch(`${fieldName}.splashScreen`)}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_5MB) })}
          hasRemoveConfirmation
        />
      ),
    },
  ];

  const checkboxes = [
    {
      name: `${fieldName}.showAllAtOnce`,
      label: <StyledBodyLarge>{t('showAllQuestionsAtOnce')}</StyledBodyLarge>,
    },
    {
      name: `${fieldName}.isSkippable`,
      label: <StyledBodyLarge>{t('allowToSkipAllItems')}</StyledBodyLarge>,
    },
    {
      name: `${fieldName}.responseIsEditable`,
      label: <StyledBodyLarge>{t('disableAbilityToChangeResponse')}</StyledBodyLarge>,
      isInversed: true,
    },
    {
      name: `${fieldName}.isReviewable`,
      disabled: hasUnsupportedReviewableItemTypes || activityWithReviewable,
      label: (
        <StyledBodyLarge sx={{ position: 'relative' }}>
          <Tooltip tooltipTitle={isReviewableExistsTooltip || isReviewableUnsupportedTooltip}>
            <span>{t('onlyAdminPanelActivity')}</span>
          </Tooltip>
          <Tooltip tooltipTitle={t('onlyAdminPanelActivityTooltip')}>
            <span>
              <StyledCheckboxTooltipSvg id="more-info-outlined" />
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
              name={`${fieldName}.name`}
              maxLength={MAX_NAME_LENGTH}
              label={t('activityName')}
            />
          </Box>
          <InputController
            {...commonProps}
            name={`${fieldName}.description`}
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
