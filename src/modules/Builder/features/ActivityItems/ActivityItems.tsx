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
import { mapApiItemToItemConfigurationForm } from './ActivityItems.utils';

export const ActivityItems = () => {
  const { t } = useTranslation('app');
  const [activeItemId, setActiveItemId] = useState('');

  const { name } = useCurrentActivity();
  const { control, watch } = useFormContext();

  const { append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: `${name}.items`,
  });

  const items = watch(`${name}.items`);
  const activeItemIndex = items?.findIndex((item: ItemFormValues) => item.id === activeItemId);
  const activeItem = items?.[activeItemIndex];

  //TODO: add edit items
  const handleRemoveItem = (id: string) => {
    if (id === activeItem?.id) setActiveItemId('');

    removeItem(activeItemIndex);
  };

  const handleAddItem = () => {
    const item = getNewActivityItem();
    appendItem(item);
    setActiveItemId(item.id);
  };

  useBreadcrumbs([
    {
      icon: 'item-outlined',
      label: t('items'),
    },
  ]);

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
          item={mapApiItemToItemConfigurationForm(activeItem)}
          name={`${name}.items[${activeItemIndex}]`}
        />
      )}
    </StyledContainer>
  );
};
