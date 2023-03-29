import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash.uniqueid';

import { Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { APIItem } from 'modules/Builder/api';
import {
  useBuilderSessionStorageFormValues,
  useBuilderSessionStorageApplyChanges,
} from 'shared/hooks';

import { ItemConfiguration } from './ItemConfiguration';
import { LeftBar } from './LeftBar';
import { StyledWrapper } from './ActivityItems.styles';
import { items } from './ActivityItems.const';

export const ActivityItems = () => {
  const { getFormValues } = useBuilderSessionStorageFormValues<{ items: APIItem[] }>({ items });
  const [currentItems, setCurrentItems] = useState<APIItem[]>(getFormValues().items);
  const { t } = useTranslation('app');
  const [activeItemId, setActiveItemId] = useState('');

  const activeItem = currentItems.find((item) => item.id === activeItemId) || null;

  const { applyChanges } = useBuilderSessionStorageApplyChanges();

  const handleItemChange = (id: string) => (data: Omit<APIItem, 'id' | 'hidden'>) => {
    const updatedItems = currentItems.map((item) =>
      item.id !== id
        ? item
        : {
            id: item.id,
            hidden: item.hidden,
            ...data,
          },
    );
    setCurrentItems(updatedItems);
    applyChanges({
      items: updatedItems,
    });
  };
  const onAddItem = () => {
    const newItemId = uniqueId();
    const updatedItems = currentItems.concat({
      id: newItemId,
      name: 'NewItem',
    } as APIItem);
    setActiveItemId(newItemId);
    setCurrentItems(updatedItems);
    applyChanges({
      items: updatedItems,
    });
  };

  const onRemoveItem = (id: string) => {
    if (!id) return;

    const updatedItems = currentItems.filter((item) => item.id !== id);
    setCurrentItems(updatedItems);
    setActiveItemId('');
  };

  useBreadcrumbs([
    {
      icon: <Svg id="item-outlined" width="18" height="18" />,
      label: t('items'),
    },
  ]);

  return (
    <StyledWrapper>
      <LeftBar
        items={currentItems}
        activeItemId={activeItemId}
        onSetActiveItem={setActiveItemId}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />
      {activeItemId && (
        <ItemConfiguration item={activeItem} onItemChange={handleItemChange(activeItemId)} />
      )}
    </StyledWrapper>
  );
};
