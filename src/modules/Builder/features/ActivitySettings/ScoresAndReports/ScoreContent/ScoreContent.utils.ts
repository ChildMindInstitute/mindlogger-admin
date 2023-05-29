import { Item, MultiSelectItem, SingleSelectItem, SliderItem } from 'shared/state';
import { ItemResponseType, CalculationType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';

import { scoreIdBase } from './ScoreContent.const';

export const getTableScoreItems = (items: Item[]) =>
  items.map((item) => ({
    id: getEntityKey(item),
    name: `${item.name}: ${item.question}`,
  }));

export const getScoreId = (name: string, calculationType: CalculationType) =>
  `${scoreIdBase[calculationType]}_${name}`;

export const getScoreRangeLabel = (minScore?: number, maxScore?: number) =>
  minScore && maxScore ? `${minScore.toFixed(2)} ~ ${maxScore.toFixed(2)}` : '-';

const getItemScoreRange = (item: Item) => {
  let scores: number[] = [];
  if (
    item.responseType === ItemResponseType.SingleSelection ||
    item.responseType === ItemResponseType.MultipleSelection
  ) {
    scores = (item as SingleSelectItem | MultiSelectItem).responseValues.options
      ?.filter((option) => !option.isHidden)
      .map((option) => option.score)
      .filter(Boolean) as number[];
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

  itemsScore
    .filter((item) => !item.config.skippableItem)
    .forEach((item) => {
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
