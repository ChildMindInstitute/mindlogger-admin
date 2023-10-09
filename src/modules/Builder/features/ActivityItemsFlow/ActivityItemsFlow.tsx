import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Box } from '@mui/material';

import { StyledObserverTarget, StyledTitleMedium, theme } from 'shared/styles';
import { BuilderContainer } from 'shared/features';
import { ConditionalLogic } from 'shared/state';
import { Spinner } from 'shared/components';
import { useActivitiesRedirection, useCurrentActivity } from 'modules/Builder/hooks';
import { useDataPreloader } from 'modules/Builder/hooks/useDataPreloader';

import { ItemFlow } from './ItemFlow';
import { ActivityItemsFlowHeader } from './ActivityItemsFlowHeader';
import { RemoveItemFlowPopup } from './RemoveItemFlowPopup';
import { getEmptyFlowItem } from './ActivityItemsFlow.utils';
import {
  ACTIVITY_ITEMS_FLOW_END_ITEM_CLASS,
  ACTIVITY_ITEMS_FLOW_LIST_CLASS,
} from './ActivityItemsFlow.const';

export const ActivityItemsFlow = () => {
  const { t } = useTranslation('app');
  const [itemIndexToDelete, setItemIndexToDelete] = useState(-1);

  const { control } = useFormContext();
  const { fieldName } = useCurrentActivity();
  useActivitiesRedirection();

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

  const { data, isPending } = useDataPreloader<ConditionalLogic>({
    data: flowItems,
    rootSelector: `.${ACTIVITY_ITEMS_FLOW_LIST_CLASS}`,
    targetSelector: `.${ACTIVITY_ITEMS_FLOW_END_ITEM_CLASS}`,
  });

  const headerProps = {
    isAddItemFlowDisabled: items?.length < 2 || isPending,
    onAddItemFlow: handleAddItemFlow,
  };
  const contentSx = { minHeight: '15rem', gap: '2.4rem', position: 'relative' };

  const isRemovePopupOpened = itemIndexToDelete !== -1;

  return (
    <BuilderContainer
      title={t('activityItemsFlow')}
      Header={ActivityItemsFlowHeader}
      headerProps={headerProps}
      hasMaxWidth
      contentClassName={ACTIVITY_ITEMS_FLOW_LIST_CLASS}
      contentSxProps={contentSx}
    >
      {!!data?.length &&
        data.map((flowItem: ConditionalLogic, index: number) => (
          <ItemFlow
            key={`item-flow-${flowItem.key}`}
            name={conditionalLogicName}
            index={index}
            onRemove={() => handleRemoveItemFlow(index)}
          />
        ))}
      {!data?.length && !isPending && (
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
