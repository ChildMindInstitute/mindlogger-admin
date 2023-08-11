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
import { Tooltip, Uploader, CropRatio } from 'shared/components';
import {
  ItemResponseType,
  MAX_DESCRIPTION_LENGTH,
  MAX_FILE_SIZE_25MB,
  MAX_NAME_LENGTH,
} from 'shared/consts';
import { byteFormatter } from 'shared/utils';
import { BuilderContainer } from 'shared/features';
import { ActivityFormValues, ItemFormValues } from 'modules/Builder/types';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';

import { Uploads } from '../../components';
import { StyledContainer } from './ActivityAbout.styles';
import { itemsForReviewableActivity, commonUploaderProps } from './ActivityAbout.const';
import { useCheckIfItemsHaveVariables } from './ActivityAbout.hooks';

export const ActivityAbout = () => {
  const { t } = useTranslation();

  useBreadcrumbs();
  useActivitiesRedirection();

  const { control, setValue, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const hasVariableAmongItems = useCheckIfItemsHaveVariables();

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
  const variableAmongItemsTooltip = hasVariableAmongItems
    ? t('activityHasVariableAmongItems')
    : null;
  const activityCannotBeOnePageAssessmentTooltip = hasVariableAmongItems
    ? t('activityCannotBeOnePageAssessment')
    : null;

  const commonInputProps = {
    control,
    fullWidth: true,
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
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_25MB) })}
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
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_25MB) })}
          cropRatio={CropRatio.SplashScreen}
        />
      ),
    },
  ];

  const checkboxes = [
    {
      name: `${fieldName}.showAllAtOnce`,
      disabled: hasVariableAmongItems,
      label: (
        <StyledBodyLarge sx={{ position: 'relative' }}>
          <Tooltip tooltipTitle={activityCannotBeOnePageAssessmentTooltip}>
            <span>{t('showAllQuestionsAtOnce')}</span>
          </Tooltip>
        </StyledBodyLarge>
      ),
    },
    {
      name: `${fieldName}.isSkippable`,
      disabled: hasVariableAmongItems,
      label: (
        <StyledBodyLarge sx={{ position: 'relative' }}>
          <Tooltip tooltipTitle={variableAmongItemsTooltip}>
            <span>{t('allowToSkipAllItems')}</span>
          </Tooltip>
        </StyledBodyLarge>
      ),
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
              {...commonInputProps}
              name={`${fieldName}.name`}
              maxLength={MAX_NAME_LENGTH}
              label={t('activityName')}
            />
          </Box>
          <InputController
            {...commonInputProps}
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
