import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Condition } from 'shared/state';
import { StyledFlexColumn, StyledBodyLarge, theme, variables } from 'shared/styles';
import { ConditionRow } from 'modules/Builder/components';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { ItemFlowContentProps } from './ItemFlowContent.types';
import { SummaryRow } from '../SummaryRow';

export const ItemFlowContent = ({
  name,
  onRemove,
  'data-testid': dataTestid,
}: ItemFlowContentProps) => {
  const { t } = useTranslation('app');
  const { getFieldState } = useFormContext();
  const { fieldName } = useCurrentActivity();

  const [itemKey, conditions] = useWatch({ name: [`${name}.itemKey`, `${name}.conditions`] });

  const { error } = getFieldState(name);
  const { error: conditionalError } = getFieldState(`${name}.itemKey`);

  const errorMessage = conditionalError?.message ?? t('fillInAllRequired');

  return (
    <StyledFlexColumn sx={{ gap: '1.2rem' }}>
      {conditions?.map((condition: Condition, index: number) => (
        <ConditionRow
          key={`item-flow-condition-${condition.key}`}
          name={name}
          activityName={fieldName}
          index={index}
          onRemove={() => onRemove(index)}
          autoTrigger={!!itemKey}
          data-testid={`${dataTestid}-condition-${index}`}
          showError={false}
        />
      ))}
      <SummaryRow
        key={`item-flow-condition-${name}`}
        name={name}
        activityName={fieldName}
        data-testid={`${dataTestid}-summary`}
      />
      {error && (
        <StyledBodyLarge sx={{ color: variables.palette.semantic.error, pl: theme.spacing(0.8) }}>
          {errorMessage}
        </StyledBodyLarge>
      )}
    </StyledFlexColumn>
  );
};
