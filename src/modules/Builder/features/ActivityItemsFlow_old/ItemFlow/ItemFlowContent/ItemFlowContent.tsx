import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ConditionRowOld } from 'modules/Builder/components';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { Condition } from 'shared/state';
import { StyledBodyLarge, theme, variables } from 'shared/styles';
import { createArray } from 'shared/utils';

import { SummaryRow } from '../SummaryRow';
import { StyledItemFlowContent } from './ItemFlowContent.styles';
import { ItemFlowContentProps } from './ItemFlowContent.types';
import { StaticConditionRow } from './StaticConditionRow';

export const ItemFlowContent = ({
  name,
  isStatic,
  onRemove,
  'data-testid': dataTestid,
}: ItemFlowContentProps) => {
  const { t } = useTranslation('app');
  const { getFieldState, watch } = useFormContext();
  const { fieldName } = useCurrentActivity();

  const conditions = watch(`${name}.conditions`);
  const itemKey = watch(`${name}.itemKey`);

  if (isStatic) {
    const staticConditions = createArray(conditions?.length, (index) => index);

    return (
      <StyledItemFlowContent>
        {staticConditions.map((_, index) => (
          <StaticConditionRow key={`static-condition-row-${index}`} />
        ))}
        <StaticConditionRow isSummary />
      </StyledItemFlowContent>
    );
  }

  const { error } = getFieldState(name);
  const { error: conditionalError } = getFieldState(`${name}.itemKey`);

  const errorMessage = conditionalError?.message ?? t('fillInAllRequired');

  return (
    <StyledItemFlowContent>
      {conditions?.map((condition: Condition, index: number) => (
        <ConditionRowOld
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
        key={`item-flow-condition-${itemKey}`}
        name={name}
        activityName={fieldName}
        data-testid={`${dataTestid}-summary`}
      />
      {error && (
        <StyledBodyLarge
          sx={{ color: variables.palette.error, pl: theme.spacing(0.8) }}
          data-testid={`${dataTestid}-error`}
        >
          {errorMessage}
        </StyledBodyLarge>
      )}
    </StyledItemFlowContent>
  );
};
