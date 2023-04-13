import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { StyledContainer } from 'shared/styles';

import { ItemConfiguration } from './ItemConfiguration';
import { LeftBar } from './LeftBar';

export const ActivityItems = () => {
  const { t } = useTranslation('app');
  const [activeItemId, setActiveItemId] = useState('');

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

  const handleRemoveItem = (id: string) => {
    if (id === activeItem?.id) setActiveItemId('');

    removeItem(activeItemIndex);
  };

  const handleAddItem = () => {
    const item = getNewActivityItem();
    appendItem(item);
    setActiveItemId(item.id);
  };

  return (
    <StyledContainer>
      <LeftBar
        items={items}
        activeItemId={activeItemId}
        onSetActiveItem={setActiveItemId}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />
      {activeItemId && (
        <ItemConfiguration
          key={`item-${activeItemId}`}
          name={`${name}.items.${activeItemIndex}`}
          onClose={() => setActiveItemId('')}
        />
      )}
    </StyledContainer>
  );
};
