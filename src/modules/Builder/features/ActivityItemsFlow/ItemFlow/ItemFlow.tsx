import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray } from 'react-hook-form';
import { Badge, Box } from '@mui/material';

import { Svg } from 'shared/components';
import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledObserverTarget,
  theme,
} from 'shared/styles';
import { useIntersectionObserver } from 'shared/hooks';
import { Condition } from 'shared/state';
import { observerStyles } from 'shared/consts';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { toggleBooleanState } from 'shared/utils/toggleBooleanState';

import { ItemFlowActions } from './ItemFlowActions';
import { ItemFlowProps } from './ItemFlow.types';
import { getEmptyCondition, getObserverSelector } from './ItemFlow.utils';
import { StyledTitle, StyledCollapse } from './ItemFlow.styles';
import { ItemFlowContent } from './ItemFlowContent';

export const ItemFlow = ({ name, index, isStaticActive, onRemove }: ItemFlowProps) => {
  const { t } = useTranslation('app');
  const [isExpanded, setExpanded] = useState(true);
  const [isStatic, setStatic] = useState(isStaticActive);

  const itemName = `${name}.${index}`;
  const conditionsName = `${itemName}.conditions`;
  const dataTestid = `builder-activity-item-flow-${index}`;

  const { control, getFieldState } = useCustomFormContext();
  const { append: appendCondition, remove: removeCondition } = useFieldArray<
    Record<string, Condition[]>
  >({
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

  useIntersectionObserver({
    targetSelector: `.${getObserverSelector(index)}`,
    onAppear: () => setStatic(false),
    onHide: () => setStatic(true),
    isActive: isStaticActive,
  });

  useEffect(() => {
    if (!isStaticActive) setStatic(false);
  }, [isStaticActive]);

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledObserverTarget className={getObserverSelector(index)} sx={observerStyles} />
      <StyledCollapse in={isExpanded} timeout={0} collapsedSize="8rem" data-testid={dataTestid}>
        <StyledFlexTopCenter sx={{ minHeight: '4.8rem' }}>
          <StyledClearedButton
            sx={{ p: theme.spacing(1) }}
            onClick={toggleBooleanState(setExpanded)}
            data-testid={`${dataTestid}-collapse`}
          >
            <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
          </StyledClearedButton>
          <StyledLabelBoldLarge data-testid={`${dataTestid}-title`}>{title}</StyledLabelBoldLarge>
          <ItemFlowActions
            name={itemName}
            onAdd={handleAddCondition}
            onRemove={onRemove}
            data-testid={dataTestid}
            open={isExpanded}
            onToggle={toggleBooleanState(setExpanded)}
          />
        </StyledFlexTopCenter>
        {isExpanded && (
          <ItemFlowContent
            name={itemName}
            onRemove={handleRemoveCondition}
            data-testid={dataTestid}
            isStatic={isStatic}
          />
        )}
      </StyledCollapse>
    </Box>
  );
};
