import { FieldValues, UseFormSetValue } from 'react-hook-form';

import {
  ActivitySettingsScore,
  Item,
  MultiSelectItem,
  SingleAndMultipleSelectionOption,
  SingleSelectItem,
  SliderItem,
} from 'shared/state';
import { ItemResponseType, CalculationType, ConditionalLogicMatch } from 'shared/consts';
import { getEntityKey } from 'shared/utils';

import { scoreIdBase } from './ScoreContent.const';

export const getTableScoreItems = (items: Item[]) =>
  items.map((item) => ({
    id: getEntityKey(item),
    name: `${item.name}: ${item.question}`,
  }));

export const getScoreId = (name: string, calculationType: CalculationType) =>
  `${scoreIdBase[calculationType]}_${name.toLowerCase()}`;

export const getScoreRangeLabel = (minScore?: number, maxScore?: number) =>
  minScore && maxScore ? `${minScore.toFixed(2)} ~ ${maxScore.toFixed(2)}` : '-';

const getItemScoreRange = (item: Item) => {
  let scores: number[] = [];
  if (
    item.responseType === ItemResponseType.SingleSelection ||
    item.responseType === ItemResponseType.MultipleSelection
  ) {
    scores = (item as SingleSelectItem | MultiSelectItem).responseValues.options?.reduce(
      (result: number[], option: SingleAndMultipleSelectionOption) => {
        if (!option.isHidden && option.score) {
          return [...result, option.score];
        }

        return result;
      },
      [],
    ) as unknown as number[];
  } else {
    scores = (item as SliderItem).responseValues.scores || [];
  }

  let maxScore = 0;
  const minScore = scores.length && Math.min(...scores);
  if (
    item.responseType === ItemResponseType.SingleSelection ||
    item.responseType === ItemResponseType.Slider
  ) {
    maxScore = scores.length && Math.max(...scores);
  } else if (item.responseType === ItemResponseType.MultipleSelection) {
    maxScore = scores.reduce((acc, score) => (score > 0 || 0) && acc + score, 0);
  }

  return { maxScore, minScore };
};

export const getScoreRange = (itemsScore: Item[], calculationType: CalculationType) => {
  let totalMinScore = 0,
    totalMaxScore = 0;
  const count = itemsScore.length;

  itemsScore.forEach((item) => {
    if (item.config.skippableItem) return;

    const { minScore, maxScore } = getItemScoreRange(item);
    totalMinScore += minScore;
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

export const getDefaultConditionalValue = (scoreId: string) => ({
  name: '',
  id: scoreId,
  showMessage: false,
  flagScore: false,
  message: undefined,
  printItems: false,
  itemsPrint: undefined,
  match: ConditionalLogicMatch.All,
  conditions: [{}],
});

export const getIsScoreIdVariable = (score: ActivitySettingsScore) => {
  const { id } = score;
  let isVariable = false;

  const isMessageIncludeScoreId = (showMessage: boolean, message?: string) => {
    if (showMessage) {
      isVariable = !!message?.includes(`[[${id}]]`);
      if (isVariable) return;
    }
  };

  isMessageIncludeScoreId(score.showMessage, score.message);

  score.conditionalLogic?.forEach((condition) => {
    isMessageIncludeScoreId(condition.showMessage, condition.message);
  });

  return isVariable;
};

export const updateMessagesWithVariable = (
  setValue: UseFormSetValue<FieldValues>,
  name: string,
  score: ActivitySettingsScore,
  newScoreId: string,
) => {
  const { id, showMessage, message, conditionalLogic } = score;

  const updateMessage = (fieldName: string, showMessage: boolean, message?: string) => {
    if (showMessage && message) {
      setValue(`${fieldName}.message`, message.replaceAll(`[[${id}]]`, `[[${newScoreId}]]`));
    }
  };

  updateMessage(name, showMessage, message);
  conditionalLogic?.forEach((condition, index) =>
    updateMessage(`${name}.conditionalLogic.[${index}]`, condition.showMessage, condition.message),
  );
};
