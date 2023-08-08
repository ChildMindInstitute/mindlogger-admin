import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Badge } from '@mui/material';

import { ConditionRow, ToggleItemContainer } from 'modules/Builder/components';
import { StyledFlexColumn } from 'shared/styles';
import { Condition } from 'shared/state';

import { Actions } from './Actions';
import { SummaryRow } from './SummaryRow';
import { ItemFlowProps, ContentProps } from './ItemFlow.types';
import { getEmptyCondition } from './ItemFlow.utils';
import { StyledTitle } from './ItemFlow.styles';

const Content = ({ items, name, conditionalError, onRemove }: ContentProps) => (
  <StyledFlexColumn sx={{ gap: '1.2rem' }}>
    {items?.map((condition: Condition, index: number) => (
      <ConditionRow
        key={`item-flow-condition-${condition.key}`}
        name={name}
        index={index}
        onRemove={() => onRemove(index)}
        autoTrigger
      />
    ))}
    <SummaryRow name={name} error={conditionalError} />
  </StyledFlexColumn>
);

export const ItemFlow = ({ name, index, onRemove }: ItemFlowProps) => {
  const { t } = useTranslation('app');

  const itemName = `${name}.${index}`;
  const conditionsName = `${itemName}.conditions`;

  const { control, watch, getFieldState } = useFormContext();
  const { append: appendCondition, remove: removeCondition } = useFieldArray({
    control,
    name: conditionsName,
  });
  const conditions = watch(conditionsName);

  const handleAddCondition = () => {
    appendCondition(getEmptyCondition());
  };
  const handleRemoveCondition = (index: number) => {
    removeCondition(index);
  };

  const { error } = getFieldState(itemName);
  const { error: conditionalError } = getFieldState(`${itemName}.itemKey`);

  const title = (
    <StyledTitle sx={{ position: 'relative' }}>
      {error && <Badge variant="dot" color="error" />}
      {t('activityItemsFlowItemTitle', { index: index + 1 })}
    </StyledTitle>
  );

  return (
    <ToggleItemContainer
      title={title}
      Content={Content}
      HeaderContent={Actions}
      contentProps={{
        items: conditions,
        name: itemName,
        onRemove: handleRemoveCondition,
        conditionalError,
      }}
      headerContentProps={{ name: itemName, onAdd: handleAddCondition, onRemove }}
    />
  );
};
