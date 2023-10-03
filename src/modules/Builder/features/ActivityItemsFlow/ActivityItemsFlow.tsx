import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Box } from '@mui/material';

import { StyledObserverTarget, StyledTitleMedium, theme } from 'shared/styles';
import { BuilderContainer } from 'shared/features';
import { ConditionalLogic } from 'shared/state';
import { Spinner } from 'shared/components';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';

import { ItemFlow } from './ItemFlow';
import { ActivityItemsFlowHeader } from './ActivityItemsFlowHeader';
import { RemoveItemFlowPopup } from './RemoveItemFlowPopup';
import { getEmptyFlowItem } from './ActivityItemsFlow.utils';
import { useItemsFlowSlicedData } from './ActivityItemsFlow.hooks';
import {
  ACTIVITY_ITEMS_FLOW_END_ITEM_CLASS,
  ACTIVITY_ITEMS_FLOW_LIST_CLASS,
} from './ActivityItemsFlow.const';

export const ActivityItemsFlow = () => {
  const { t } = useTranslation('app');
  const [itemIndexToDelete, setItemIndexToDelete] = useState(-1);

  const { control, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();
  useActivitiesRedirection();

  const conditionalLogicName = `${fieldName}.conditionalLogic`;
  const {
    fields: flowItems,
    append: appendFlowItem,
    remove: removeFlowItem,
  } = useFieldArray<Record<string, ConditionalLogic[]>>({
    control,
    name: conditionalLogicName,
  });

  const items = watch(`${fieldName}.items`);

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

  const headerProps = {
    isAddItemFlowDisabled: items?.length < 2,
    onAddItemFlow: handleAddItemFlow,
  };

  const isRemovePopupOpened = itemIndexToDelete !== -1;

  const { data, isPending } = useItemsFlowSlicedData(flowItems);

  return (
    <BuilderContainer
      title={t('activityItemsFlow')}
      Header={ActivityItemsFlowHeader}
      headerProps={headerProps}
      hasMaxWidth
      contentClassName={ACTIVITY_ITEMS_FLOW_LIST_CLASS}
    >
      {data?.length ? (
        data.map((flowItem: ConditionalLogic, index: number) => (
          <ItemFlow
            key={`item-flow-${flowItem.key}`}
            name={conditionalLogicName}
            index={index}
            onRemove={() => handleRemoveItemFlow(index)}
          />
        ))
      ) : (
        <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
          {t('activityItemsFlowDescription')}
        </StyledTitleMedium>
      )}
      <StyledObserverTarget className={ACTIVITY_ITEMS_FLOW_END_ITEM_CLASS} />
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
