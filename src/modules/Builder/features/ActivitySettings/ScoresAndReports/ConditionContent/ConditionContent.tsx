import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { Condition } from 'shared/state';
import { getEntityKey } from 'shared/utils';
import { ConditionRow } from 'modules/Builder/components';
import { ConditionRowType } from 'modules/Builder/types';

import { ConditionContentProps } from './ConditionContent.types';
import { ScoreSummaryRow } from './ScoreSummaryRow';
import { StyledButton } from '../ScoresAndReports.styles';

export const ConditionContent = ({ name, type }: ConditionContentProps) => {
  const { t } = useTranslation();
  const conditionsName = `${name}.conditions`;

  const { control, watch, getValues } = useFormContext();
  const { append: appendCondition, remove: removeCondition } = useFieldArray({
    control,
    name: conditionsName,
  });

  const conditions = watch(conditionsName);

  const handleAddCondition = () => {
    appendCondition({});
  };

  return (
    <>
      {conditions?.map((condition: Condition, index: number) => (
        <ConditionRow
          key={`score-condition-${getEntityKey(condition) || index}`}
          name={name}
          index={index}
          type={type}
          scoreId={type === ConditionRowType.Score && getValues(`${name}.id`)}
          onRemove={() => removeCondition(index)}
        />
      ))}
      <StyledButton
        startIcon={<Svg id="add" width="20" height="20" />}
        onClick={handleAddCondition}
      >
        {t('addCondition')}
      </StyledButton>
      <ScoreSummaryRow name={name} />
    </>
  );
};
