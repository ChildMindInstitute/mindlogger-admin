import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Badge } from '@mui/material';

import { Svg } from 'shared/components';
import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  theme,
} from 'shared/styles';

import { ItemFlowActions } from './ItemFlowActions';
import { ItemFlowProps } from './ItemFlow.types';
import { getEmptyCondition } from './ItemFlow.utils';
import { StyledTitle, StyledCollapse } from './ItemFlow.styles';
import { ItemFlowContent } from './ItemFlowContent';

export const ItemFlow = ({ name, index, onRemove }: ItemFlowProps) => {
  const { t } = useTranslation('app');
  const [isExpanded, setExpanded] = useState(true);

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
    <StyledTitle component="span">
      {error && <Badge variant="dot" color="error" />}
      {t('activityItemsFlowItemTitle', { index: index + 1 })}
    </StyledTitle>
  );

  return (
    <StyledCollapse in={isExpanded} timeout={0} collapsedSize="8rem" data-testid={dataTestid}>
      <StyledFlexTopCenter sx={{ minHeight: '4.8rem' }}>
        <StyledClearedButton
          sx={{ p: theme.spacing(1) }}
          onClick={() => setExpanded((prev) => !prev)}
          data-testid={`${dataTestid}-collapse`}
        >
          <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
        </StyledClearedButton>
        <StyledLabelBoldLarge>{title}</StyledLabelBoldLarge>
        <ItemFlowActions
          name={itemName}
          onAdd={handleAddCondition}
          onRemove={onRemove}
          data-testid={dataTestid}
          open={isExpanded}
          onToggle={() => setExpanded((prev) => !prev)}
        />
      </StyledFlexTopCenter>
      {isExpanded && (
        <ItemFlowContent
          name={itemName}
          onRemove={handleRemoveCondition}
          data-testid={dataTestid}
        />
      )}
    </StyledCollapse>
  );
};
