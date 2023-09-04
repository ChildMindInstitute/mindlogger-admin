import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
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
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';
import { ConditionalLogic } from 'shared/state';
import { getEntityKey } from 'shared/utils';
import { getItemConditionDependencies } from 'modules/Builder/features/ActivityItems/ActivityItems.utils';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { StyledContent, StyledItemConfiguration } from './ItemConfiguration.styles';
import { ItemConfigurationProps, ItemsOptionGroup } from './ItemConfiguration.types';
import { itemsTypeOptions } from './ItemConfiguration.const';
import { getInputTypeTooltip } from './ItemConfiguration.utils';
import { OptionalItemsAndSettings, OptionalItemsRef } from './OptionalItemsAndSettings';
import { itemsForReviewableActivity } from '../../ActivityAbout/ActivityAbout.const';
import { useCheckIfItemHasVariables } from './ItemConfiguration.hooks';
import { ConfigurationHeader } from './ConfigurationHeader';
import { EditItemModal } from './EditItemModal';

export const ItemConfiguration = ({ name, onClose }: ItemConfigurationProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation('app');
  const optionalItemsRef = useRef<OptionalItemsRef | null>(null);
  const [isEditItemPopupVisible, setIsEditItemPopupVisible] = useState(false);
  const selectChangeRef = useRef<undefined | (() => void)>();

  const methods = useFormContext();
  const { fieldName, activity } = useCurrentActivity();
  const { message, isPopupVisible, onPopupConfirm } = useCheckIfItemHasVariables(name);

  const { control, watch, setValue } = methods;
  const isReviewable = watch(`${fieldName}.isReviewable`);
  const responseType = watch(`${name}.responseType`) as ItemResponseTypeNoPerfTasks;
  const currentItem = watch(name);
  const conditionalLogic = watch(`${fieldName}.conditionalLogic`);
  const conditionalLogicForItem = getItemConditionDependencies(
    currentItem,
    activity.conditionalLogic,
  );

  const availableItemsTypeOptions = isReviewable
    ? itemsTypeOptions.reduce((options: ItemsOptionGroup[], { groupName, groupOptions }) => {
        if (groupName !== 'select') return options;

        return [
          {
            groupName,
            groupOptions: groupOptions.filter(({ value }) =>
              itemsForReviewableActivity.includes(value),
            ),
          },
        ];
      }, [])
    : itemsTypeOptions;

  const handleModalSubmit = () => {
    selectChangeRef.current?.();

    if (conditionalLogicForItem?.length) {
      const conditionalLogicKeysToRemove = conditionalLogicForItem.map(
        (condition: ConditionalLogic) => getEntityKey(condition),
      );
      setValue(
        `${fieldName}.conditionalLogic`,
        conditionalLogic?.filter(
          (conditionalLogic: ConditionalLogic) =>
            !conditionalLogicKeysToRemove.includes(getEntityKey(conditionalLogic)),
        ),
      );
    }
  };

  const prepareSelectChangePopup = (handleOnChange: () => void) => {
    setIsEditItemPopupVisible(true);
    selectChangeRef.current = handleOnChange;
  };
  const checkIfSelectChangePopupIsVisible = conditionalLogicForItem?.length
    ? prepareSelectChangePopup
    : undefined;

  return (
    <>
      <StyledItemConfiguration ref={containerRef}>
        <ConfigurationHeader
          containerRef={containerRef}
          responseType={responseType}
          optionalItemsRef={optionalItemsRef}
          onClose={onClose}
        />
        <StyledContent>
          <Grid container direction="row" columns={2} spacing={2.4}>
            <Grid item xs={1}>
              <GroupedSelectSearchController
                name={`${name}.responseType`}
                options={availableItemsTypeOptions}
                checkIfSelectChangePopupIsVisible={checkIfSelectChangePopupIsVisible}
                control={control}
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
                name={`${name}.name`}
                control={control}
                label={t('itemName')}
                type="text"
                sx={{ mb: theme.spacing(4) }}
                data-testid="builder-activity-items-item-configuration-name"
              />
            </Grid>
          </Grid>
          <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>
            {t('displayedContent')}
          </StyledTitleLarge>
          <EditorController
            name={`${name}.question`}
            control={control}
            data-testid="builder-activity-items-item-configuration-description"
          />
          <OptionalItemsAndSettings name={name} ref={optionalItemsRef} />
        </StyledContent>
      </StyledItemConfiguration>
      <Modal
        open={isPopupVisible}
        onClose={onPopupConfirm}
        onSubmit={onPopupConfirm}
        width={'62'}
        title={t('variablesWarning.title')}
        buttonText={t('ok')}
        data-testid="builder-activity-items-item-configuration-variables-warning-popup"
      >
        <StyledModalWrapper>{t(message)}</StyledModalWrapper>
      </Modal>
      <EditItemModal
        itemFieldName={name}
        isPopupVisible={isEditItemPopupVisible}
        setIsPopupVisible={setIsEditItemPopupVisible}
        onModalSubmit={handleModalSubmit}
      />
    </>
  );
};
