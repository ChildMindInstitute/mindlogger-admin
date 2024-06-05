import { ChangeEvent } from 'react';
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
import { Tooltip, Uploader, CropRatio } from 'shared/components';
import {
  ItemResponseType,
  MAX_DESCRIPTION_LENGTH,
  MAX_FILE_SIZE_25MB,
  MAX_NAME_LENGTH,
  TEXTAREA_ROWS_COUNT_SM,
} from 'shared/consts';
import { byteFormatter, getEntityKey } from 'shared/utils';
import { BuilderContainer } from 'shared/features';
import { ActivityFlowFormValues, ItemFormValues } from 'modules/Builder/types';
import {
  useRedirectIfNoMatchedActivity,
  useCurrentActivity,
  useCustomFormContext,
} from 'modules/Builder/hooks';
import { getUpdatedActivityFlows } from 'modules/Builder/utils';

import { Uploads } from '../../components';
import { StyledContainer } from './ActivityAbout.styles';
import { itemsForReviewableActivity, commonUploaderProps } from './ActivityAbout.const';
import {
  useCheckIfItemsHaveRequiredItems,
  useCheckIfItemsHaveVariables,
} from './ActivityAbout.hooks';

export const ActivityAbout = () => {
  const { t } = useTranslation();

  useRedirectIfNoMatchedActivity();

  const { control, setValue, watch } = useCustomFormContext();
  const { fieldName, activity } = useCurrentActivity();
  const hasVariableAmongItems = useCheckIfItemsHaveVariables();
  const hasRequiredItems = useCheckIfItemsHaveRequiredItems();

  const activityItems = watch(`${fieldName}.items`);
  const activityFlows: ActivityFlowFormValues[] = watch('activityFlows');
  const hasUnsupportedReviewableItemTypes = activityItems?.some(
    (item: ItemFormValues) =>
      ![...itemsForReviewableActivity, ''].includes(item.responseType as ItemResponseType),
  );
  const isReviewableUnsupportedTooltip = hasUnsupportedReviewableItemTypes
    ? t('isReviewableUnsupported')
    : null;
  let allowToSkipAllItemsTooltip = hasVariableAmongItems
    ? t('activityHasVariableAmongItems')
    : null;
  if (hasRequiredItems) {
    allowToSkipAllItemsTooltip = t('activityHasRequiredItems');
  }

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
          data-testid="builder-activity-about-image"
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
          data-testid="builder-activity-about-splash-screen"
        />
      ),
    },
  ];

  const handleIsReviewableChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) return;

    const activityKey = getEntityKey(activity || {});

    const newActivityFlows = getUpdatedActivityFlows(activityFlows, activityKey);
    setValue('activityFlows', newActivityFlows);
  };

  const checkboxes = [
    {
      name: `${fieldName}.isSkippable`,
      disabled: hasVariableAmongItems || hasRequiredItems,
      label: (
        <StyledBodyLarge sx={{ position: 'relative' }}>
          <Tooltip tooltipTitle={allowToSkipAllItemsTooltip}>
            <span>{t('allowToSkipAllItems')}</span>
          </Tooltip>
        </StyledBodyLarge>
      ),
      'data-testid': 'builder-activity-about-skippable',
    },
    {
      name: `${fieldName}.responseIsEditable`,
      label: <StyledBodyLarge>{t('disableAbilityToChangeResponse')}</StyledBodyLarge>,
      isInversed: true,
      'data-testid': 'builder-activity-about-response-editable',
    },
    {
      name: `${fieldName}.isReviewable`,
      disabled: hasUnsupportedReviewableItemTypes,
      label: (
        <StyledBodyLarge sx={{ position: 'relative' }}>
          <Tooltip tooltipTitle={isReviewableUnsupportedTooltip}>
            <span>{t('onlyAdminPanelActivity')}</span>
          </Tooltip>
          <Tooltip tooltipTitle={t('onlyAdminPanelActivityTooltip')}>
            <span>
              <StyledCheckboxTooltipSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledBodyLarge>
      ),
      onCustomChange: handleIsReviewableChange,
      'data-testid': 'builder-activity-about-reviewable',
    },
  ];

  return (
    <BuilderContainer title={t('aboutActivity')}>
      <Box sx={{ display: 'flex' }}>
        <StyledContainer>
          <Box sx={{ marginBottom: theme.spacing(4.4) }}>
            <InputController
              {...commonInputProps}
              key={`${fieldName}.name`}
              name={`${fieldName}.name`}
              maxLength={MAX_NAME_LENGTH}
              restrictExceededValueLength
              label={t('activityName')}
              data-testid="builder-activity-about-name"
            />
          </Box>
          <InputController
            {...commonInputProps}
            key={`${fieldName}.description`}
            name={`${fieldName}.description`}
            maxLength={MAX_DESCRIPTION_LENGTH}
            restrictExceededValueLength
            label={t('activityDescription')}
            multiline
            rows={TEXTAREA_ROWS_COUNT_SM}
            data-testid="builder-activity-about-description"
          />
        </StyledContainer>
        <Uploads uploads={uploads} />
      </Box>
      <StyledTitleMedium color={variables.palette.on_surface_variant} sx={{ marginBottom: 1.6 }}>
        {t('itemLevelSettings')}
      </StyledTitleMedium>
      <StyledFlexColumn>
        {checkboxes.map(
          ({ name, label, isInversed, disabled, 'data-testid': dataTestid, onCustomChange }) => (
            <CheckboxController
              key={name}
              control={control}
              name={name}
              label={label}
              disabled={disabled}
              isInversed={isInversed}
              onCustomChange={onCustomChange}
              data-testid={dataTestid}
            />
          ),
        )}
      </StyledFlexColumn>
    </BuilderContainer>
  );
};
