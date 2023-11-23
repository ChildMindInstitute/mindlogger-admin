import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
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

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import {
  ItemConfigurationProps,
  ItemsOptionGroup,
  UseWatchItemConfiguration,
} from './ItemConfiguration.types';
import { itemsTypeOptions } from './ItemConfiguration.const';
import { getInputTypeTooltip } from './ItemConfiguration.utils';
import { OptionalItemsAndSettings, OptionalItemsRef } from './OptionalItemsAndSettings';
import { itemsForReviewableActivity } from '../../ActivityAbout/ActivityAbout.const';
import { useCheckIfItemHasVariables } from './ItemConfiguration.hooks';
import { ConfigurationHeader } from './ConfigurationHeader';
import { EditItemModal } from './EditItemModal';

export const ItemConfiguration = ({ name, onClose }: ItemConfigurationProps) => {
  const { t } = useTranslation('app');
  const optionalItemsRef = useRef<OptionalItemsRef | null>(null);
  const [isEditItemPopupVisible, setIsEditItemPopupVisible] = useState(false);
  const selectChangeRef = useRef<undefined | (() => void)>();

  const { control } = useFormContext();
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
            />
          </Grid>
        </Grid>
        <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>{t('displayedContent')}</StyledTitleLarge>
        <EditorController
          withDebounce
          name={`${name}.question`}
          control={control}
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
