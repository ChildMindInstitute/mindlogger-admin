import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWatch } from 'react-hook-form';
import { Grid } from '@mui/material';

import { Modal } from 'shared/components';
import { EditorController, InputController } from 'shared/components/FormComponents';
import {
  StyledBodyMedium,
  StyledModalWrapper,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { BuilderContainer } from 'shared/features';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';
import { useFilterConditionalLogicByItem } from 'modules/Builder/hooks/useFilterConditionalLogicByItem';
import { getItemConditionDependencies } from 'modules/Builder/features/ActivityItems/ActivityItems.utils';
import { ItemTestFunctions } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';
import { useCheckAndTriggerOnNameUniqueness, useCustomFormContext } from 'modules/Builder/hooks';
import { ItemResponseType } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import {
  ItemConfigurationProps,
  ItemsOptionGroup,
  UseWatchItemConfiguration,
} from './ItemConfiguration.types';
import { getItemsTypeOptions, getInputTypeTooltip } from './ItemConfiguration.utils';
import { OptionalItemsAndSettings, OptionalItemsRef } from './OptionalItemsAndSettings';
import { itemsForReviewableActivity } from '../../ActivityAbout/ActivityAbout.const';
import { useCheckIfItemHasVariables } from './ItemConfiguration.hooks';
import { ConfigurationHeader } from './ConfigurationHeader';
import { EditItemModal } from './EditItemModal';

export const ItemConfiguration = ({ name, onClose }: ItemConfigurationProps) => {
  const { t } = useTranslation('app');
  const { featureFlags } = useFeatureFlags();
  const optionalItemsRef = useRef<OptionalItemsRef | null>(null);
  const [isEditItemPopupVisible, setIsEditItemPopupVisible] = useState(false);
  const selectChangeRef = useRef<undefined | (() => void)>();
  const { control, getFieldState, setValue } = useCustomFormContext();
  const { fieldName, activity } = useCurrentActivity();
  const { message, isPopupVisible, onPopupConfirm } = useCheckIfItemHasVariables(name);
  const [isReviewable, responseType, currentItem]: UseWatchItemConfiguration = useWatch({
    name: [`${fieldName}.isReviewable`, `${name}.responseType`, name],
  });
  const filterConditionalLogicByItem = useFilterConditionalLogicByItem(currentItem);
  const conditionalLogicForItem = getItemConditionDependencies(
    currentItem,
    activity?.conditionalLogic,
  );

  const availableItemsTypeOptions = getItemsTypeOptions({ featureFlags })
    .reduce((options: ItemsOptionGroup[], { groupName, groupOptions }) => {
      if (isReviewable) {
        // Reviewable activities only support 3 possible item types in the 'select' group:
        // single selection, multiple selection, and slider. Skip all other groups and item types.

        if (groupName !== 'select') return options;

        return [
          {
            groupName,
            groupOptions: groupOptions.filter(({ value }) =>
              itemsForReviewableActivity.includes(value),
            ),
          },
        ];
      }

      let newGroupOptions = groupOptions;

      switch (groupName) {
        case 'downloadable':
          newGroupOptions = groupOptions.filter(
            ({ value }) =>
              value !== ItemResponseType.PhrasalTemplate || featureFlags.enablePhrasalTemplate,
          );
          break;
        case 'input':
          newGroupOptions = groupOptions.filter(
            ({ value }) =>
              value !== ItemResponseType.ParagraphText || featureFlags.enableParagraphTextItem,
          );
          break;
        case 'import':
          newGroupOptions = groupOptions.filter(
            ({ value }) =>
              value !== ItemResponseType.RequestHealthRecordData ||
              featureFlags.enableEhrHealthData === 'active',
          );
          break;
      }

      return [
        ...options,
        {
          groupName,
          groupOptions: newGroupOptions,
        },
      ];
    }, [])
    .filter(({ groupOptions }) => groupOptions.length > 0);

  useCheckAndTriggerOnNameUniqueness({
    currentPath: name,
    entitiesFieldPath: `${fieldName}.items`,
  });

  const handleModalSubmit = () => {
    selectChangeRef.current?.();
    filterConditionalLogicByItem();
  };

  const prepareSelectChangePopup = (handleOnChange: () => void) => {
    setIsEditItemPopupVisible(true);
    selectChangeRef.current = handleOnChange;
  };
  const checkIfSelectChangePopupIsVisible = conditionalLogicForItem?.length
    ? prepareSelectChangePopup
    : undefined;

  const containerSxProps = {
    margin: 0,
    flexGrow: 1,
    height: '100%',
  };
  const itemNameHelperTextSxProps = {
    '&&': {
      top: '100%',
      whiteSpace: 'normal',
      overflow: 'unset',
      bottom: 'unset',
    },
  };

  const hasSameNameInSystemItemsError =
    getFieldState(`${name}.name`)?.error?.type === ItemTestFunctions.ExistingNameInSystemItem;

  const placeholder =
    responseType === ItemResponseType.RequestHealthRecordData
      ? t('requestHealthRecordDataSettings.placeholder')
      : undefined;

  return (
    <>
      <BuilderContainer
        title={t('itemConfiguration')}
        Header={ConfigurationHeader}
        headerProps={{
          responseType,
          optionalItemsRef,
          onClose,
        }}
        sxProps={containerSxProps}
      >
        <Grid container direction="row" columns={2} spacing={2.4}>
          <Grid item xs={1}>
            <GroupedSelectSearchController
              name={`${name}.responseType`}
              options={availableItemsTypeOptions}
              checkIfSelectChangePopupIsVisible={checkIfSelectChangePopupIsVisible}
              control={control}
              setValue={setValue}
              fieldName={name}
              data-testid="builder-activity-items-item-configuration-response-type"
            />
            <StyledBodyMedium
              sx={{ m: theme.spacing(0.2, 1.6, 4.8, 1.6) }}
              color={variables.palette.on_surface_variant}
            >
              {responseType && getInputTypeTooltip()[responseType]}
            </StyledBodyMedium>
          </Grid>
          <Grid item xs={1}>
            <InputController
              fullWidth
              withDebounce
              name={`${name}.name`}
              control={control}
              label={t('itemName')}
              type="text"
              sx={{ mb: theme.spacing(4) }}
              data-testid="builder-activity-items-item-configuration-name"
              FormHelperTextProps={{
                ...(hasSameNameInSystemItemsError && { sx: itemNameHelperTextSxProps }),
              }}
            />
          </Grid>
        </Grid>
        <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>{t('displayedContent')}</StyledTitleLarge>
        <EditorController
          withDebounce
          name={`${name}.question`}
          control={control}
          placeholder={placeholder}
          data-testid="builder-activity-items-item-configuration-description"
        />
        <OptionalItemsAndSettings name={name} ref={optionalItemsRef} />
      </BuilderContainer>
      {isPopupVisible && (
        <Modal
          open
          onClose={onPopupConfirm}
          onSubmit={onPopupConfirm}
          width={'62'}
          title={t('variablesWarning.title')}
          buttonText={t('ok')}
          data-testid="builder-activity-items-item-configuration-variables-warning-popup"
        >
          <StyledModalWrapper>{t(message)}</StyledModalWrapper>
        </Modal>
      )}
      {isEditItemPopupVisible && (
        <EditItemModal
          open
          itemFieldName={name}
          onClose={() => setIsEditItemPopupVisible(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
};
