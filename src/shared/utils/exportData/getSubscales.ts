import {
  ActivitySettingsSubscale,
  ParsedSubscale,
  ScoresObject,
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
  SubscaleSetting,
} from 'shared/state';
import { SubscaleTotalScore } from 'shared/consts';
import {
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { ActivityItems } from './prepareData';
import { getObjectFromList } from '../builderHelpers';
import { getReportCSVObject } from './getReportCSVObject';

export const getSubScaleScore = (subscalesSum: number, type: SubscaleTotalScore, length: number) =>
  type === SubscaleTotalScore.Sum ? subscalesSum : subscalesSum / length;

export const calcScores = (
  data: ActivitySettingsSubscale,
  activityItems: ActivityItems,
  subscalesObject: Record<string, ActivitySettingsSubscale>,
): number => {
  const itemsSum = data.items.reduce((acc, item) => {
    if (!activityItems[item] && !subscalesObject[item]) {
      return acc;
    }

    if (subscalesObject[item]) {
      return calcScores(subscalesObject[item], activityItems, subscalesObject);
    }

    const answer = activityItems[item].answer as
      | DecryptedMultiSelectionAnswer
      | DecryptedSingleSelectionAnswer
      | DecryptedSliderAnswer;
    const typedOptions = activityItems[item].options as SingleAndMultipleSelectItemResponseValues &
      SliderItemResponseValues;
    let value = 0;

    if (typedOptions?.options?.length) {
      const scoresObject = typedOptions.options?.reduce((acc: ScoresObject, item) => {
        if (item?.value && item?.score) {
          acc[item.value as keyof ScoresObject] = item.score;
        }

        return acc;
      }, {});

      if (Array.isArray(answer?.value)) {
        value = answer.value?.reduce((res: number, item) => res + scoresObject[item], 0);
      } else {
        value = scoresObject[answer?.value] || 0;
      }
    }

    if (typedOptions?.minValue && typedOptions?.scores?.length) {
      const min = typedOptions.minValue;
      const max = typedOptions.maxValue;
      const scores = typedOptions.scores;
      const options = Array.from({ length: max - min + 1 }, (_, i) => i + min);

      value = scores[options.findIndex((item) => item === answer.value)] || 0;
    }

    return acc + value;
  }, 0);

  const calculetedScore = getSubScaleScore(itemsSum, data.scoring, data.items.length);

  if (data?.subscaleTableData) {
    const subscaleTableDataItem = data.subscaleTableData?.find(({ sex, age, rawScore }) => {
      const withSex = sex ? sex === activityItems.sex : true;
      const withAge = age ? age === activityItems.age : true;

      return withSex && withAge && rawScore === String(calculetedScore);
    });

    return Number(subscaleTableDataItem?.score) || calculetedScore;
  }

  return calculetedScore;
};

export const getSubscales = (
  subscaleSetting: SubscaleSetting,
  activityItems: ActivityItems,
  answers: ReturnType<typeof getReportCSVObject>[],
) => {
  if (!subscaleSetting?.subscales?.length) return {};

  const subscalesObject = getObjectFromList<ActivitySettingsSubscale>(
    subscaleSetting.subscales,
    (item) => item.name,
  );

  const { parsedSubscales } = subscaleSetting.subscales.reduce(
    (acc: { parsedSubscales: ParsedSubscale; subscalesSum: number }, item) => {
      const calculetedSubscale = calcScores(item, activityItems, subscalesObject);

      acc.parsedSubscales[item.name] = calculetedSubscale;
      // if (item?.subscaleTableData) {
      //   const subscaleTableDataItem = item.subscaleTableData?.find(
      //     ({ score, sex, age, rawScore }) => {
      //       const withSex = sex ? sex === activityItems.sex : true;
      //       const withAge = age ? age === activityItems.age : true;

      //       return (
      //         withSex &&
      //         withAge &&
      //         score === String(calculetedSubscale) &&
      //         rawScore === String(subscaleRawScore)
      //       );
      //     },
      //   );

      //   if (subscaleTableDataItem?.optionalText) {
      //     acc.parsedSubscales[`Optional text for ${item.name}`] =
      //       subscaleTableDataItem.optionalText;
      //   }
      // }

      return acc;
    },
    { parsedSubscales: {}, subscalesSum: 0 },
  );

  return {
    ...(subscaleSetting?.calculateTotalScore && {
      'Final SubScale Score': calcScores(
        {
          items: Object.keys(activityItems),
          scoring: subscaleSetting.calculateTotalScore,
        } as ActivitySettingsSubscale,
        activityItems,
        {},
      ),
    }),
    ...parsedSubscales,
  };
};
