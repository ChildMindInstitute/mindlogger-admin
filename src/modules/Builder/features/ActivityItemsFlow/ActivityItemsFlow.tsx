import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { StyledTitleMedium, theme } from 'shared/styles';
import { BuilderContainer } from 'shared/features';
import { ConditionalLogic } from 'shared/state';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';

import { ItemFlow } from './ItemFlow';
import { ActivityItemsFlowHeader } from './ActivityItemsFlowHeader';
import { RemoveItemFlowPopup } from './RemoveItemFlowPopup';
import { getEmptyFlowItem } from './ActivityItemsFlow.utils';

export const ActivityItemsFlow = () => {
  const { t } = useTranslation('app');
  const [itemIndexToDelete, setItemIndexToDelete] = useState(-1);

  const { control, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();

  const conditionalLogicName = `${fieldName}.conditionalLogic`;
  const { append: appendFlowItem, remove: removeFlowItem } = useFieldArray({
    control,
    name: conditionalLogicName,
  });

  const flowItems = watch(conditionalLogicName);
  const items = watch(`${fieldName}.items`);

  const handleAddItemFlow = () => {
    appendFlowItem(getEmptyFlowItem());
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

  return (
    <BuilderContainer
      title={t('activityItemsFlow')}
      Header={ActivityItemsFlowHeader}
      headerProps={headerProps}
    >
      {flowItems?.length ? (
        flowItems.map((flowItem: ConditionalLogic, index: number) => (
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
