import { memo, useCallback } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ConditionRow, ConditionRowOld } from 'modules/Builder/components';
import {
  DEFAULT_PAYLOAD_MAX_VALUE,
  DEFAULT_PAYLOAD_MIN_VALUE,
} from 'modules/Builder/components/ConditionRow/ConditionRow.const';
import { OnChangeConditionType } from 'modules/Builder/components/ConditionRow/ConditionRow.types';
import { getPayload } from 'modules/Builder/components/ConditionRow/ConditionRow.utils';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { ConditionRowType } from 'modules/Builder/types';
import { Svg } from 'shared/components/Svg';
import { ConditionType } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { Condition, RangeValueCondition } from 'shared/state';
import { StyledBodyMedium, theme, variables } from 'shared/styles';
import { getEntityKey } from 'shared/utils';

import { StyledButton } from '../ScoresAndReports.styles';
import { ConditionContentProps } from './ConditionContent.types';
import { getDefaultScoreCondition } from './ConditionContent.utils';
import { defaultSectionCondition } from './CondtitionContent.const';
import { ScoreSummaryRow } from './ScoreSummaryRow';

const ConditionContentComponent = ({
  name,
  type,
  score,
  scoreRange,
  'data-testid': dataTestid,
}: ConditionContentProps) => {
  const { t } = useTranslation();
  const conditionsName = `${name}.conditions`;
  const { featureFlags } = useFeatureFlags();
  const { control, getFieldState, setValue } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();
  const {
    fields: conditions,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray<Record<string, Condition[]>>({
    control,
    name: conditionsName,
  });
  const error = getFieldState(`${name}.conditions`).error;

  const handleAddCondition = useCallback(() => {
    appendCondition(
      type === ConditionRowType.Score && score
        ? getDefaultScoreCondition(score)
        : (defaultSectionCondition as Condition),
    );
  }, [appendCondition, type, score]);

  const handleChangeConditionType: OnChangeConditionType = useCallback(
    ({ conditionType, conditionPayload, conditionPayloadName, selectedItem }) => {
      if (
        type === ConditionRowType.Score &&
        (conditionType === ConditionType.Between || conditionType === ConditionType.OutsideOf)
      ) {
        const { minValue, maxValue } = (conditionPayload as RangeValueCondition['payload']) ?? {};

        const payload = {
          minValue: +(minValue ?? scoreRange?.minScore ?? DEFAULT_PAYLOAD_MIN_VALUE).toFixed(2),
          maxValue: +(maxValue ?? scoreRange?.maxScore ?? DEFAULT_PAYLOAD_MAX_VALUE).toFixed(2),
        };

        return setValue(conditionPayloadName, payload);
      }

      setValue(conditionPayloadName, getPayload({ conditionType, conditionPayload, selectedItem }));
    },
    [type, scoreRange, setValue],
  );

  return (
    <>
      {conditions?.map((condition: Condition, index: number) =>
        featureFlags.enableItemFlowExtendedItems ? (
          <ConditionRow
            key={`score-condition-${getEntityKey(condition) || index}-${index}`}
            name={name}
            activityName={fieldName}
            index={index}
            type={type}
            scoreKey={type === ConditionRowType.Score ? score?.key : ''}
            onRemove={() => removeCondition(index)}
            onChangeConditionType={handleChangeConditionType}
            data-testid={`${dataTestid}-condition-${index}`}
          />
        ) : (
          <ConditionRowOld
            key={`score-condition-${getEntityKey(condition) || index}-${index}`}
            name={name}
            activityName={fieldName}
            index={index}
            type={type}
            scoreKey={type === ConditionRowType.Score ? score?.key : ''}
            onRemove={() => removeCondition(index)}
            onChangeConditionType={handleChangeConditionType}
            data-testid={`${dataTestid}-condition-${index}`}
          />
        ),
      )}
      {!!error && (
        <StyledBodyMedium color={variables.palette.error}>{error.message}</StyledBodyMedium>
      )}
      <StyledButton
        startIcon={<Svg id="add" width="20" height="20" />}
        onClick={handleAddCondition}
        sx={{ m: theme.spacing(1.2, 0, 1.2, -2.4) }}
        data-testid={`${dataTestid}-add-condition`}
      >
        {t('addCondition')}
      </StyledButton>
      <ScoreSummaryRow name={name} data-testid={`${dataTestid}-summary-row`} />
    </>
  );
};

// Memoize component to prevent unnecessary re-renders
export const ConditionContent = memo(ConditionContentComponent);
