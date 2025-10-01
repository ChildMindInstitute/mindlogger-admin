import { ChangeEvent } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Link } from '@mui/material';

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
import { useFeatureFlags } from 'shared/hooks';

import { Uploads } from '../../components';
import { StyledContainer } from './ActivityAbout.styles';
import {
  itemsForReviewableActivity,
  commonUploaderProps,
  SUPPORT_LINK,
} from './ActivityAbout.const';
import {
  useCheckIfItemsHaveRequiredItems,
  useCheckIfItemsHaveVariables,
} from './ActivityAbout.hooks';

// Utility to handle activity name validation and error clearing
const handleDisplayNameValidation = (
  value: string,
  applyChange: () => void,
  trigger: (fieldName: string) => void,
  clearErrors: (fieldName: string) => void,
  fieldName: string,
) => {
  applyChange();
  if (!value || value.trim() === '') {
    setTimeout(() => trigger(fieldName), 0);
  } else {
    clearErrors(fieldName);
  }
};

export const ActivityAbout = () => {
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlags();

  useRedirectIfNoMatchedActivity();

  const { control, setValue, trigger, clearErrors } = useCustomFormContext();
  const { fieldName, activity } = useCurrentActivity();
  const hasVariableAmongItems = useCheckIfItemsHaveVariables();
  const hasRequiredItems = useCheckIfItemsHaveRequiredItems();

  const [activityItems, activityFlows, activityImage, splashScreen]: [
    ItemFormValues[],
    ActivityFlowFormValues[],
    string,
    string,
  ] = useWatch({
    name: [
      `${fieldName}.items`,
      'activityFlows',
      `${fieldName}.image`,
      `${fieldName}.splashScreen`,
    ],
  });

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
          getValue={() => activityImage}
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
          getValue={() => splashScreen}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_25MB) })}
          cropRatio={CropRatio.SplashScreen}
          data-testid="builder-activity-about-splash-screen"
        />
      ),
    },
  ];

  const handleIsReviewableChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked || !activity) return;

    const activityKey = getEntityKey(activity);

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
          <Tooltip
            tooltipTitle={
              <>
                {`${t('onlyAdminPanelActivityTooltip')} `}
                <Link
                  sx={{ color: variables.palette.inverse_on_surface }}
                  target="_blank"
                  href={SUPPORT_LINK}
                >
                  {SUPPORT_LINK}
                </Link>
              </>
            }
          >
            <span>
              <StyledCheckboxTooltipSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledBodyLarge>
      ),
      onCustomChange: handleIsReviewableChange,
      'data-testid': 'builder-activity-about-reviewable',
    },
    ...(featureFlags.enableActivityAssign
      ? [
          {
            name: `${fieldName}.autoAssign`,
            label: (
              <StyledBodyLarge sx={{ position: 'relative' }}>
                <span>{t('autoAssignActivity')}</span>
                <Tooltip tooltipTitle={t('autoAssignTooltip')}>
                  <span>
                    <StyledCheckboxTooltipSvg id="more-info-outlined" />
                  </span>
                </Tooltip>
              </StyledBodyLarge>
            ),
            'data-testid': 'builder-activity-about-auto-assign',
          },
        ]
      : []),
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
              onChange={(e, applyChange) =>
                handleDisplayNameValidation(
                  e.target.value,
                  applyChange,
                  trigger,
                  clearErrors,
                  `${fieldName}.name`,
                )
              }
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
        {checkboxes.map((props) => (
          <CheckboxController {...props} key={props.name} control={control} />
        ))}
      </StyledFlexColumn>
    </BuilderContainer>
  );
};
