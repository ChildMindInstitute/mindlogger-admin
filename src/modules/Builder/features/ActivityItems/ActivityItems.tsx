import { useMemo, useState } from 'react';
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
  const [isNewItem, setIsNewItem] = useState(true);

  const activeItem = useMemo(() => {
    if (isNewItem) return null;

    const currentItem = currentItems.find((i) => i.id === activeItemId);
    if (!currentItem) return null;

    return currentItem;
  }, [activeItemId, isNewItem]);

  const { applyChanges } = useBuilderSessionStorageApplyChanges();

  const handleItemChange = (id: string) => (data: Omit<APIItem, 'id' | 'hidden'>) => {
    const updatedItems = currentItems.map((i) =>
      i.id !== id
        ? i
        : {
            id: i.id,
            hidden: i.hidden,
            ...data,
          },
    );
    setCurrentItems(updatedItems);
    applyChanges({
      items: updatedItems,
    });
  };
  const handleAddItem = () => {
    const newItemId = uniqueId();
    const updatedItems = currentItems.concat({
      id: newItemId,
      name: 'NewItem',
    } as APIItem);
    setIsNewItem(true);
    setActiveItemId(newItemId);
    setCurrentItems(updatedItems);
    applyChanges({
      items: updatedItems,
    });
  };
  const handleSetActiveItem = (id: string) => {
    setIsNewItem(false);
    if (!id) return;

    setActiveItemId(id);
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
        handleSetActiveItem={handleSetActiveItem}
        handleAddItem={handleAddItem}
      />
      {(activeItemId || isNewItem) && (
        <ItemConfiguration
          item={isNewItem ? null : activeItem}
          onItemChange={handleItemChange(activeItemId)}
        />
      )}
    </StyledWrapper>
  );
};
