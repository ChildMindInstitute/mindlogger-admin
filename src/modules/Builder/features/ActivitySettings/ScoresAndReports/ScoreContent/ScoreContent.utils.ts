import { v4 as uuidv4 } from 'uuid';

import i18n from 'i18n';
import { ScoreConditionalLogic, SingleAndMultiSelectOption } from 'shared/state';
import {
  ItemResponseType,
  CalculationType,
  ConditionalLogicMatch,
  ScoreReportType,
  ConditionType,
} from 'shared/consts';
import {
  DEFAULT_PAYLOAD_MAX_VALUE,
  DEFAULT_PAYLOAD_MIN_VALUE,
} from 'modules/Builder/components/ConditionRow/ConditionRow.const';

import { ForbiddenScoreIdSymbols, scoreIdBase } from './ScoreContent.const';
import {
  GetIsScoreIdVariable,
  GetScoreRange,
  GetScoreRangeLabel,
  IsMessageIncludeScoreId,
  ItemsWithScore,
  UpdateMessage,
  UpdateMessagesWithVariable,
  UpdateScoreConditionIds,
  UpdateScoreConditionsPayload,
} from './ScoreContent.types';
import { getScoreConditionId } from './ScoreCondition';

const { t } = i18n;

export const getScoreItemsColumns = () => [
  {
    key: 'name',
    label: t('availableItems'),
  },
];

export const getSelectedItemsColumns = () => [
  {
    key: 'name',
    label: t('selectedItems'),
  },
];

export const getScoreId = (name: string, calculationType: CalculationType) =>
  `${scoreIdBase[calculationType]}_${(name || '')
    .toLowerCase()
    .replaceAll(ForbiddenScoreIdSymbols, '_')}`;

export const getScoreRangeLabel = ({ minScore, maxScore }: GetScoreRangeLabel) =>
  `${minScore.toFixed(2)} ~ ${maxScore.toFixed(2)}`;

const getItemScoreRange = (item: ItemsWithScore) => {
  let scores: number[];
  if (
    item.responseType === ItemResponseType.SingleSelection ||
    item.responseType === ItemResponseType.MultipleSelection
  ) {
    scores = item.responseValues.options?.reduce(
      (result: number[], option: SingleAndMultiSelectOption) => {
        if (!option.isHidden && typeof option.score === 'number') {
          return [...result, option.score];
        }

        return result;
      },
      [],
    ) as number[];
  } else {
    scores = item.responseValues.scores as number[];
  }

  let maxScore = 0;
  const minScore = Math.min(...scores);
  if (
    item.responseType === ItemResponseType.SingleSelection ||
    item.responseType === ItemResponseType.Slider
  ) {
    maxScore = Math.max(...scores);
  } else if (item.responseType === ItemResponseType.MultipleSelection) {
    maxScore = scores.reduce((acc, score) => (score > 0 ? acc + score : acc), 0);
  }

  return { maxScore, minScore };
};

export const getScoreRange = ({ items, calculationType, activity }: GetScoreRange) => {
  let totalMinScore = 0,
    totalMaxScore = 0;
  const count = items.length;

  items.forEach((item) => {
    const { minScore, maxScore } = getItemScoreRange(item);

    if (!item.config.skippableItem && !activity?.isSkippable) {
      totalMinScore += minScore;
    }

    totalMaxScore += maxScore;
  });

  switch (calculationType) {
    case CalculationType.Sum:
      return { minScore: totalMinScore, maxScore: totalMaxScore };
    case CalculationType.Average:
      return {
        minScore: count ? totalMinScore / count : 0,
        maxScore: count ? totalMaxScore / count : 0,
      };
    case CalculationType.Percentage:
      return { minScore: totalMaxScore ? (totalMinScore / totalMaxScore) * 100 : 0, maxScore: 100 };
  }
};

export const getScoreConditionalDefaults = (id: string, key: string) => ({
  name: '',
  id,
  key: uuidv4(),
  showMessage: true,
  flagScore: false,
  message: undefined,
  printItems: false,
  itemsPrint: [],
  match: ConditionalLogicMatch.All,
  conditions: [{ itemName: key, type: '' }],
});

const isMessageIncludeScoreId = ({ showMessage, id, message }: IsMessageIncludeScoreId) =>
  showMessage && !!message?.includes(`[[${id}]]`);

export const getIsScoreIdVariable = ({ id, reports, isScore }: GetIsScoreIdVariable) => {
  let isVariable = false;

  reports?.forEach((report) => {
    if (isVariable) return;

    if (
      (isVariable = isMessageIncludeScoreId({
        showMessage: report.showMessage,
        id,
        message: report.message,
      }))
    ) {
      return;
    }

    if (report.type === ScoreReportType.Score) {
      report.conditionalLogic?.forEach((condition) => {
        if (isVariable) return;

        if (
          (isVariable = isMessageIncludeScoreId({
            showMessage: condition.showMessage,
            id,
            message: condition.message,
          }))
        ) {
          return;
        }

        if (isScore) {
          isVariable = getIsScoreIdVariable({
            id: getScoreConditionId(id, condition.name),
            reports,
            isScore: false,
          });
        }
      });
    }
  });

  return isVariable;
};

const updateMessage = ({
  setValue,
  fieldName,
  id,
  newScoreId,
  showMessage,
  message,
}: UpdateMessage) => {
  if (showMessage && message) {
    setValue(`${fieldName}.message`, message.replaceAll(`[[${id}]]`, `[[${newScoreId}]]`));
  }
};

export const updateMessagesWithVariable = ({
  setValue,
  reportsName,
  reports,
  oldScoreId,
  newScoreId,
  isScore,
}: UpdateMessagesWithVariable) => {
  reports.forEach((report, index) => {
    const { type, showMessage, message, conditionalLogic } = report;
    const reportName = `${reportsName}.${index}`;
    updateMessage({
      setValue,
      fieldName: reportName,
      id: oldScoreId,
      newScoreId,
      showMessage,
      message,
    });

    if (type === ScoreReportType.Score) {
      conditionalLogic?.forEach((condition, key) => {
        updateMessage({
          setValue,
          fieldName: `${reportName}.conditionalLogic.${key}`,
          id: oldScoreId,
          newScoreId,
          showMessage: condition.showMessage,
          message: condition.message,
        });

        if (isScore) {
          updateMessagesWithVariable({
            setValue,
            reportsName,
            reports,
            oldScoreId: getScoreConditionId(oldScoreId, condition.name),
            newScoreId: getScoreConditionId(newScoreId, condition.name),
            isScore: false,
          });
        }
      });
    }
  });
};

export const updateScoreConditionIds = ({
  setValue,
  conditionsName,
  conditions,
  scoreId,
}: UpdateScoreConditionIds) => {
  conditions?.forEach((condition, index) => {
    setValue(`${conditionsName}.${index}.id`, getScoreConditionId(scoreId, condition.name));
  });
};

export const updateScoreConditionsPayload = ({
  setValue,
  scoreConditionalsName,
  getValues,
  selectedItems,
  calculationType,
  activity,
}: UpdateScoreConditionsPayload) => {
  const scoreConditionals = getValues(scoreConditionalsName) as ScoreConditionalLogic[];
  if (!scoreConditionals) return;

  const newScoreRange = getScoreRange({
    items: selectedItems,
    calculationType,
    activity,
  });
  scoreConditionals.forEach((scoreConditional, index) => {
    scoreConditional.conditions?.forEach((condition, conditionIndex) => {
      if (condition.type === ConditionType.Between || condition.type === ConditionType.OutsideOf) {
        const conditionPayloadName = `${scoreConditionalsName}.${index}.conditions.${conditionIndex}.payload`;
        const newPayload = {
          minValue: +(newScoreRange?.minScore ?? DEFAULT_PAYLOAD_MIN_VALUE).toFixed(2),
          maxValue: +(newScoreRange?.maxScore ?? DEFAULT_PAYLOAD_MAX_VALUE).toFixed(2),
        };
        setValue(conditionPayloadName, newPayload);
      }
    });
  });
};
