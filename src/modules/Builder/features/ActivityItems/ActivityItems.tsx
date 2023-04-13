import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { StyledContainer, StyledModalWrapper } from 'shared/styles';
import { Modal } from 'shared/components';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet';

import { ItemConfiguration } from './ItemConfiguration';
import { LeftBar } from './LeftBar';

export const ActivityItems = () => {
  const { t } = useTranslation('app');
  const [activeItemId, setActiveItemId] = useState('');
  const [itemIdToDelete, setItemIdToDelete] = useState('');

  const { name, activity } = useCurrentActivity();
  const { control, watch } = useFormContext();

  const { append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: `${name}.items`,
  });

  useBreadcrumbs([
    {
      icon: 'item-outlined',
      label: t('items'),
    },
  ]);

  if (!activity) return null;

  const items = watch(`${name}.items`);
  const activeItemIndex = items?.findIndex((item: ItemFormValues) => item.id === activeItemId);
  const activeItem = items?.[activeItemIndex];
  const itemToDelete = items?.find((item: ItemFormValues) => itemIdToDelete === item.id);
  const itemName = itemToDelete?.name;

  const handleRemoveClick = (id: string) => {
    setItemIdToDelete(id);
  };

  const handleAddItem = () => {
    const item = getNewActivityItem();
    appendItem(item);
    setActiveItemId(item.id);
  };

  const handleModalClose = () => {
    setItemIdToDelete('');
  };

  const handleModalSubmit = () => {
    if (itemIdToDelete === activeItemId) setActiveItemId('');

    handleModalClose();
    removeItem(activeItemIndex);
  };

  return (
    <StyledContainer>
      <LeftBar
        items={items}
        activeItemId={activeItemId}
        onSetActiveItem={setActiveItemId}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveClick}
      />
      {activeItemId && (
        <ItemConfiguration
          key={`item-${activeItemId}`}
          name={`${name}.items.${activeItemIndex}`}
          onClose={() => setActiveItemId('')}
        />
      )}
      {!!itemIdToDelete && (
        <Modal
          open={!!itemIdToDelete}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          onSecondBtnSubmit={handleModalClose}
          title={t('deleteItem')}
          buttonText={t('delete')}
          secondBtnText={t('cancel')}
          hasSecondBtn
          submitBtnColor="error"
        >
          <StyledModalWrapper>
            <Trans i18nKey="deleteItemDescription">
              Are you sure you want to delete the Item
              <strong>
                <>{{ itemName }}</>
              </strong>
              ?
            </Trans>
          </StyledModalWrapper>
        </Modal>
      )}
    </StyledContainer>
  );
};
