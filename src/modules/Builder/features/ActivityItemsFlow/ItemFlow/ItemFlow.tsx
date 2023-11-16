import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Badge } from '@mui/material';

import { ToggleItemContainer } from 'modules/Builder/components';

import { ItemFlowActions } from './ItemFlowActions';
import { ItemFlowProps } from './ItemFlow.types';
import { getEmptyCondition } from './ItemFlow.utils';
import { StyledTitle } from './ItemFlow.styles';
import { ItemFlowContent } from './ItemFlowContent';

export const ItemFlow = ({ name, index, onRemove }: ItemFlowProps) => {
  const { t } = useTranslation('app');

  const itemName = `${name}.${index}`;
  const conditionsName = `${itemName}.conditions`;
  const dataTestid = `builder-activity-item-flow-${index}`;

  const { control, getFieldState } = useFormContext();
  const { append: appendCondition, remove: removeCondition } = useFieldArray({
    control,
    name: conditionsName,
  });

  const handleAddCondition = () => {
    appendCondition(getEmptyCondition());
  };
  const handleRemoveCondition = (index: number) => {
    removeCondition(index);
  };

  const { error } = getFieldState(itemName);

  const title = (
    <StyledTitle component="span" sx={{ position: 'relative' }}>
      {error && <Badge variant="dot" color="error" />}
      {t('activityItemsFlowItemTitle', { index: index + 1 })}
    </StyledTitle>
  );

  return (
    <ToggleItemContainer
      title={title}
      Content={ItemFlowContent}
      HeaderContent={ItemFlowActions}
      contentProps={{
        name: itemName,
        onRemove: handleRemoveCondition,
        'data-testid': dataTestid,
      }}
      headerContentProps={{
        name: itemName,
        onAdd: handleAddCondition,
        onRemove,
        'data-testid': dataTestid,
      }}
      data-testid={dataTestid}
    />
  );
};
