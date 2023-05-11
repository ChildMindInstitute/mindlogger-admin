import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { ToggleItemContainer } from 'modules/Builder/components';
import { StyledFlexColumn } from 'shared/styles';
import { Condition } from 'shared/state';

import { ItemFlowActions } from './ItemFlowActions';
import { ItemFlowProps } from './ItemFlow.types';
import { getEmptyCondition } from './ItemFlow.utils';
import { ItemFlowCondition } from './ItemFlowCondition';

const Content = ({ items, name }: { items: Condition[]; name: string }) => (
  <StyledFlexColumn>
    {items?.map((_: Condition, index: number) => (
      <ItemFlowCondition key={`item-flow-condition-${index}`} name={name} index={index} />
    ))}
  </StyledFlexColumn>
);

export const ItemFlow = ({ name, index, onRemove }: ItemFlowProps) => {
  const { t } = useTranslation('app');

  const itemName = `${name}.${index}`;
  const conditionsName = `${itemName}.conditions`;

  const { control, watch } = useFormContext();
  const { append: appendCondition } = useFieldArray({
    control,
    name: `${itemName}.conditions`,
  });
  const conditions = watch(conditionsName);

  const onAddCondition = () => {
    appendCondition(getEmptyCondition());
  };

  return (
    <ToggleItemContainer
      title={t('activityItemsFlowItemTitle', { index: index + 1 })}
      Content={Content}
      HeaderContent={ItemFlowActions}
      headerStyles={{ justifyContent: 'space-between' }}
      contentProps={{ items: conditions, name: conditionsName }}
      headerContentProps={{ name: itemName, onAdd: onAddCondition, onRemove }}
    />
  );
};
