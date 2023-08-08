import { FieldValues, UseFormSetValue } from 'react-hook-form';

import {
  ScoreReport,
  Item,
  MultiSelectItem,
  SingleAndMultiSelectOption,
  SingleSelectItem,
  SliderItem,
} from 'shared/state';
import { ItemResponseType, CalculationType, ConditionalLogicMatch } from 'shared/consts';
import { getEntityKey } from 'shared/utils';

import { ForbiddenScoreIdSymbols, scoreIdBase } from './ScoreContent.const';

export const getTableScoreItems = (items: Item[]) =>
  items.map((item) => ({
    id: getEntityKey(item),
    name: item.name,
    label: `${item.name}: ${item.question}`,
  }));

export const getScoreId = (name: string, calculationType: CalculationType) =>
  `${scoreIdBase[calculationType]}_${name.toLowerCase().replaceAll(ForbiddenScoreIdSymbols, '_')}`;

export const getScoreRangeLabel = (minScore: number, maxScore: number) =>
  `${minScore.toFixed(2)} ~ ${maxScore.toFixed(2)}`;

const getItemScoreRange = (item: Item) => {
  let scores: number[] = [];
  if (
    item.responseType === ItemResponseType.SingleSelection ||
    item.responseType === ItemResponseType.MultipleSelection
  ) {
    scores = (item as SingleSelectItem | MultiSelectItem).responseValues.options?.reduce(
      (result: number[], option: SingleAndMultiSelectOption) => {
        if (!option.isHidden && typeof option.score === 'number') {
          return [...result, option.score];
        }

        return result;
      },
      [],
    ) as number[];
  } else {
    scores = (item as SliderItem).responseValues.scores as number[];
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
  showMessage: true,
  flagScore: false,
  message: undefined,
  printItems: false,
  itemsPrint: [],
  match: ConditionalLogicMatch.All,
  conditions: [{ itemName: scoreId }],
});

const isMessageIncludeScoreId = (showMessage: boolean, id: string, message?: string) =>
  showMessage && !!message?.includes(`[[${id}]]`);

export const getIsScoreIdVariable = (score: ScoreReport) => {
  const { id } = score;
  let isVariable = false;

  isVariable = isMessageIncludeScoreId(score.showMessage, id, score.message);
  score.conditionalLogic?.forEach((condition) => {
    isVariable = isMessageIncludeScoreId(condition.showMessage, id, condition.message);
  });

  return isVariable;
};

const updateMessage = (
  setValue: UseFormSetValue<FieldValues>,
  fieldName: string,
  id: string,
  newScoreId: string,
  showMessage: boolean,
  message?: string,
) => {
  if (showMessage && message) {
    setValue(`${fieldName}.message`, message.replaceAll(`[[${id}]]`, `[[${newScoreId}]]`));
  }
};

export const updateMessagesWithVariable = (
  setValue: UseFormSetValue<FieldValues>,
  name: string,
  score: ScoreReport,
  newScoreId: string,
) => {
  const { id, showMessage, message, conditionalLogic } = score;
  updateMessage(setValue, name, id, newScoreId, showMessage, message);
  conditionalLogic?.forEach((condition, index) =>
    updateMessage(
      setValue,
      `${name}.conditionalLogic.[${index}]`,
      id,
      newScoreId,
      condition.showMessage,
      condition.message,
    ),
  );
};
