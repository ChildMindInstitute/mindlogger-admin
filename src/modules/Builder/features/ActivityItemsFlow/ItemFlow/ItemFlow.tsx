import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { ToggleItemContainer } from 'modules/Builder/components';

import { ItemFlowActions } from './ItemFlowActions';
import { ItemFlowProps } from './ItemFlow.types';
import { getEmptyCondition } from './ItemFlow.utils';

export const ItemFlow = ({ name, index, onRemove }: ItemFlowProps) => {
  const { t } = useTranslation('app');

  const itemName = `${name}.${index}`;

  const { control } = useFormContext();
  const { append: appendCondition } = useFieldArray({
    control,
    name: `${itemName}.conditions`,
  });

  const Content = () => <div>Item flow</div>;

  const onAddCondition = () => {
    appendCondition(getEmptyCondition());
  };

  return (
    <ToggleItemContainer
      title={t('activityItemsFlowItemTitle', { index })}
      Content={Content}
      HeaderContent={ItemFlowActions}
      headerContentProps={{ name: itemName, onAdd: onAddCondition, onRemove }}
    />
  );
};
