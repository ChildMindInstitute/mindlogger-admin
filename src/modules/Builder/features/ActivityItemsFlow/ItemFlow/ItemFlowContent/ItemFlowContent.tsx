import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Condition } from 'shared/state';
import { StyledFlexColumn, StyledBodyLarge, theme, variables } from 'shared/styles';
import { ConditionRow } from 'modules/Builder/components';

import { ItemFlowContentProps } from './ItemFlowContent.types';
import { SummaryRow } from '../SummaryRow';

export const ItemFlowContent = ({
  name,
  conditions,
  onRemove,
  'data-testid': dataTestid,
}: ItemFlowContentProps) => {
  const { t } = useTranslation('app');
  const { watch, getFieldState } = useFormContext();

  const itemKey = watch(`${name}.itemKey`);
  const { error } = getFieldState(name);
  const { error: conditionalError } = getFieldState(`${name}.itemKey`);

  const errorMessage = conditionalError?.message ?? t('fillInAllRequired');

  return (
    <StyledFlexColumn sx={{ gap: '1.2rem' }}>
      {conditions?.map((condition: Condition, index: number) => (
        <ConditionRow
          key={`item-flow-condition-${condition.key}`}
          name={name}
          index={index}
          onRemove={() => onRemove(index)}
          autoTrigger={!!itemKey}
          data-testid={`${dataTestid}-condition-${index}`}
          showError={false}
        />
      ))}
      <SummaryRow name={name} data-testid={`${dataTestid}-summary`} />
      {error && (
        <StyledBodyLarge sx={{ color: variables.palette.semantic.error, pl: theme.spacing(0.8) }}>
          {errorMessage}
        </StyledBodyLarge>
      )}
    </StyledFlexColumn>
  );
};
