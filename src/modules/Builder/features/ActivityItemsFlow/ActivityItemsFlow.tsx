import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Box } from '@mui/material';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { StyledObserverTarget, StyledTitleMedium, theme } from 'shared/styles';
import { BuilderContainer } from 'shared/features';
import { ConditionalLogic } from 'shared/state';
import { Spinner } from 'shared/components';
import { useRedirectIfNoMatchedActivity, useCurrentActivity } from 'modules/Builder/hooks';
import { useDataPreloader } from 'modules/Builder/hooks/useDataPreloader';
import { ITEMS_COUNT_TO_ACTIVATE_STATIC } from 'modules/Builder/consts';

import { ItemFlow } from './ItemFlow';
import { ActivityItemsFlowHeader } from './ActivityItemsFlowHeader';
import { RemoveItemFlowPopup } from './RemoveItemFlowPopup';
import { getEmptyFlowItem } from './ActivityItemsFlow.utils';
import {
  ACTIVITY_ITEMS_FLOW_END_ITEM_CLASS,
  ACTIVITY_ITEMS_FLOW_LIST_CLASS,
  contentStyles,
} from './ActivityItemsFlow.const';

export const ActivityItemsFlow = () => {
  const { t } = useTranslation('app');
  const [itemIndexToDelete, setItemIndexToDelete] = useState(-1);
  const { control, getValues, setError } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();
  useRedirectIfNoMatchedActivity();

  const conditionalLogicName = `${fieldName}.conditionalLogic`;
  const items = useWatch({ name: `${fieldName}.items` });

  const {
    fields: flowItems,
    append: appendFlowItem,
    remove: removeFlowItem,
  } = useFieldArray<Record<string, ConditionalLogic[]>>({
    control,
    name: conditionalLogicName,
  });

  const handleAddItemFlow = () => {
    appendFlowItem(getEmptyFlowItem() as ConditionalLogic);
  };
  const handleRemoveItemFlow = (index: number) => {
    setItemIndexToDelete(index);
  };
  const handleCloseRemovePopup = () => {
    setItemIndexToDelete(-1);
  };
  const handleConfirmRemoveItem = () => {
    removeFlowItem(itemIndexToDelete);
    handleCloseRemovePopup();
  };

  const { data: flowItemsData, isPending } = useDataPreloader<ConditionalLogic>({
    data: flowItems,
    rootSelector: `.${ACTIVITY_ITEMS_FLOW_LIST_CLASS}`,
    targetSelector: `.${ACTIVITY_ITEMS_FLOW_END_ITEM_CLASS}`,
  });

  const handleDuplicate = async (index: number) => {
    const emptyFlowItem = getEmptyFlowItem();
    const currentFlowItems = getValues(`${fieldName}.conditionalLogic`);
    const copiedFlowItem = currentFlowItems?.[index];

    if (copiedFlowItem && emptyFlowItem) {
      const newFlowItem = {
        ...emptyFlowItem,
        conditions: [...copiedFlowItem.conditions],
        match: copiedFlowItem.match,
      } as ConditionalLogic;

      appendFlowItem(newFlowItem);

      setError(`${fieldName}.conditionalLogic.${currentFlowItems.length}.itemKey`, {
        type: 'required',
      });
    }
  };

  const headerProps = {
    isAddItemFlowDisabled: items?.length < 2 || isPending,
    onAddItemFlow: handleAddItemFlow,
  };

  const isRemovePopupOpened = itemIndexToDelete !== -1;

  return (
    <BuilderContainer
      title={t('activityItemsFlow')}
      Header={ActivityItemsFlowHeader}
      headerProps={headerProps}
      hasMaxWidth
      contentClassName={ACTIVITY_ITEMS_FLOW_LIST_CLASS}
      contentSxProps={contentStyles}
    >
      {!!flowItemsData?.length &&
        flowItemsData.map((flowItem: ConditionalLogic, index: number) => (
          <ItemFlow
            key={`item-flow-${flowItem.key}`}
            name={conditionalLogicName}
            index={index}
            isStaticActive={flowItemsData.length > ITEMS_COUNT_TO_ACTIVATE_STATIC}
            onDuplicate={handleDuplicate}
            onRemove={() => handleRemoveItemFlow(index)}
          />
        ))}
      {!flowItemsData?.length && !isPending && (
        <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
          {t('activityItemsFlowDescription')}
        </StyledTitleMedium>
      )}
      <StyledObserverTarget
        className={ACTIVITY_ITEMS_FLOW_END_ITEM_CLASS}
        sx={{ position: 'absolute', bottom: '5rem' }}
      />
      {isPending && (
        <Box sx={{ position: 'relative' }}>
          <Spinner />
        </Box>
      )}
      {isRemovePopupOpened && (
        <RemoveItemFlowPopup
          open={isRemovePopupOpened}
          index={itemIndexToDelete + 1}
          onClose={handleCloseRemovePopup}
          onSubmit={handleConfirmRemoveItem}
        />
      )}
    </BuilderContainer>
  );
};
