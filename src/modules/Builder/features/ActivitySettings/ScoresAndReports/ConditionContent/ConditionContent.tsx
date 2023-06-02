import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { Condition } from 'shared/state';

import { ScoreConditionRow } from './ScoreConditionRow';
import { ConditionContentProps } from './ConditionContent.types';
import { ScoreSummaryRow } from './ScoreSummaryRow';
import { StyledButton } from '../ScoresAndReports.styles';

export const ConditionContent = ({ name, type }: ConditionContentProps) => {
  const { t } = useTranslation();
  const conditionsName = `${name}.conditions`;

  const { control, watch } = useFormContext();
  const { append: appendCondition, remove: removeCondition } = useFieldArray({
    control,
    name: conditionsName,
  });

  const conditions = watch(conditionsName);

  const handleAddCondition = () => {
    appendCondition({});
  };
  const handleRemoveCondition = (index: number) => {
    removeCondition(index);
  };

  return (
    <>
      {conditions?.map((condition: Condition, index: number) => (
        <ScoreConditionRow
          key={`score-condition-${condition.key}`}
          name={name}
          index={index}
          type={type}
          onRemove={() => handleRemoveCondition(index)}
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
