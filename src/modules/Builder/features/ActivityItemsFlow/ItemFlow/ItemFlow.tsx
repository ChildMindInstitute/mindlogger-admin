import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { ToggleItemContainer } from 'modules/Builder/components';
import { StyledFlexColumn } from 'shared/styles';
import { Condition } from 'shared/state';

import { Actions } from './Actions';
import { ConditionRow } from './ConditionRow';
import { SummaryRow } from './SummaryRow';
import { ItemFlowProps } from './ItemFlow.types';
import { getEmptyCondition } from './ItemFlow.utils';

const Content = ({ items, name }: { items: Condition[]; name: string }) => (
  <StyledFlexColumn>
    {items?.map((_: Condition, index: number) => (
      <ConditionRow key={`item-flow-condition-${index}`} name={name} index={index} />
    ))}
    <SummaryRow name={name} />
  </StyledFlexColumn>
);

export const ItemFlow = ({ name, index, onRemove }: ItemFlowProps) => {
  const { t } = useTranslation('app');

  const itemName = `${name}.${index}`;
  const conditionsName = `${itemName}.conditions`;

  const { control, watch } = useFormContext();
  const { append: appendCondition } = useFieldArray({
    control,
    name: conditionsName,
  });
  const conditions = watch(conditionsName);

  const onAddCondition = () => {
    appendCondition(getEmptyCondition());
  };

  return (
    <ToggleItemContainer
      title={t('activityItemsFlowItemTitle', { index: index + 1 })}
      Content={Content}
      HeaderContent={Actions}
      headerStyles={{ justifyContent: 'space-between' }}
      contentProps={{ items: conditions, name: itemName }}
      headerContentProps={{ name: itemName, onAdd: onAddCondition, onRemove }}
    />
  );
};
