import {
  ActivitySettingsSubscale,
  Item,
  ParsedSubscale,
  ScoresObject,
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
  SubscaleSetting,
} from 'shared/state';
import { Sex, SubscaleTotalScore } from 'shared/consts';
import {
  AnswerDTO,
  DecryptedMultiSelectionAnswer,
  DecryptedSexAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { ElementType } from 'modules/Builder/features/SaveAndPublish/SaveAndPublish.types';

import { getObjectFromList } from '../builderHelpers';
import { createArrayFromMinToMax } from '../array';

export const getSubScaleScore = (subscalesSum: number, type: SubscaleTotalScore, length: number) =>
  type === SubscaleTotalScore.Sum ? subscalesSum : subscalesSum / length;

export const parseSex = (sex: string) => (sex === Sex.M ? '1' : '2');

export const calcScores = <T>(
  data: ActivitySettingsSubscale,
  activityItems: Record<string, T & { answer: AnswerDTO; activityItem: Item }>,
  subscalesObject: Record<string, ActivitySettingsSubscale>,
): { score: number; optionText: string } => {
  const sumScore = data.items.reduce((acc, item) => {
    if (!item?.type) {
      return acc;
    }

    if (item.type === ElementType.Subscale) {
      return acc + calcScores(subscalesObject[item.name], activityItems, subscalesObject).score;
    }

    const answer = activityItems[item.name].answer as
      | DecryptedMultiSelectionAnswer
      | DecryptedSingleSelectionAnswer
      | DecryptedSliderAnswer;
    const typedOptions = activityItems[item.name].activityItem
      .responseValues as SingleAndMultipleSelectItemResponseValues & SliderItemResponseValues;
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
      const options = createArrayFromMinToMax(min, max);

      value = scores[options.findIndex((item) => item === answer.value)] || 0;
    }

    return acc + value;
  }, 0);

  const calculetedScore = getSubScaleScore(sumScore, data.scoring, data.items.length);

  if (data?.subscaleTableData) {
    const subscaleTableDataItem = data.subscaleTableData?.find(({ sex, age, rawScore }) => {
      const genderAnswer = activityItems.gender_screen?.answer as DecryptedSexAnswer;
      const withSex = sex ? parseSex(sex) === genderAnswer?.value : true;
      const withAge = age ? String(age) === activityItems.age_screen.answer : true;

      return withSex && withAge && rawScore === String(calculetedScore);
    });

    return {
      score: Number(subscaleTableDataItem?.score) || calculetedScore,
      optionText: subscaleTableDataItem?.optionalText || '',
    };
  }

  return { score: calculetedScore, optionText: '' };
};

export const getSubscales = <T>(
  subscaleSetting: SubscaleSetting,
  activityItems: Record<string, T & { activityItem: Item; answer: AnswerDTO }>,
) => {
  if (!subscaleSetting?.subscales?.length) return {};

  const subscalesObject = getObjectFromList<ActivitySettingsSubscale>(
    subscaleSetting.subscales,
    (item) => item.name,
  );

  const parsedSubscales = subscaleSetting.subscales.reduce((acc: ParsedSubscale, item) => {
    const calculetedSubscale = calcScores(item, activityItems, subscalesObject);

    acc[item.name] = calculetedSubscale.score;
    if (calculetedSubscale?.optionText) {
      acc[`Optional text for ${item.name}`] = calculetedSubscale.optionText;
    }

    return acc;
  }, {});

  const calculetedTotalScore =
    subscaleSetting?.calculateTotalScore &&
    calcScores(
      {
        name: '',
        items: Object.keys(activityItems).map((item) => ({ name: item, type: 'item' })),
        scoring: subscaleSetting.calculateTotalScore,
        subscaleTableData: subscaleSetting.totalScoresTableData,
      } as ActivitySettingsSubscale,
      activityItems,
      {},
    );

  return {
    ...(calculetedTotalScore && {
      'Final SubScale Score': calculetedTotalScore.score,
      'Optional text for Final SubScale Score': calculetedTotalScore.optionText,
    }),
    ...parsedSubscales,
  };
};
