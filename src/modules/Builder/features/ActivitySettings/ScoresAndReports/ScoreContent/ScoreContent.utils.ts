import i18n from 'i18n';
import { ScoreOrSection, SingleAndMultiSelectOption } from 'shared/state';
import {
  ItemResponseType,
  CalculationType,
  ConditionalLogicMatch,
  ScoreReportType,
} from 'shared/consts';

import { ForbiddenScoreIdSymbols, scoreIdBase } from './ScoreContent.const';
import {
  GetScoreRange,
  GetScoreRangeLabel,
  ItemsWithScore,
  UpdateMessage,
  UpdateMessagesWithVariable,
  UpdateScoreConditionIds,
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

export const getDefaultConditionalValue = (id: string, key: string) => ({
  name: '',
  id,
  showMessage: true,
  flagScore: false,
  message: undefined,
  printItems: false,
  itemsPrint: [],
  match: ConditionalLogicMatch.All,
  conditions: [{ itemName: key, type: '' }],
});

const isMessageIncludeScoreId = (showMessage: boolean, id: string, message?: string) =>
  showMessage && !!message?.includes(`[[${id}]]`);

export const getIsScoreIdVariable = (id: string, reports: ScoreOrSection[], isScore: boolean) => {
  let isVariable = false;

  reports?.forEach((report) => {
    if (isVariable) return;

    if ((isVariable = isMessageIncludeScoreId(report.showMessage, id, report.message))) {
      return;
    }

    if (report.type === ScoreReportType.Score) {
      report.conditionalLogic?.forEach((condition) => {
        if (isVariable) return;

        if ((isVariable = isMessageIncludeScoreId(condition.showMessage, id, condition.message)))
          return;

        if (isScore) {
          isVariable = getIsScoreIdVariable(
            getScoreConditionId(id, condition.name),
            reports,
            false,
          );
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
