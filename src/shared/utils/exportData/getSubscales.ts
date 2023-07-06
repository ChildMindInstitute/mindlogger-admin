import {
  ActivitySettingsSubscale,
  Item,
  ParsedSubscale,
  ScoresObject,
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
  SubscaleSetting,
} from 'shared/state';
import { FinalSubscale, LookupTableItems, Sex, SubscaleTotalScore } from 'shared/consts';
import {
  AnswerDTO,
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
  DecryptedTextAnswer,
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
): { [key: string]: { score: number; optionText: string } } => {
  const result: { [key: string]: { score: number; optionText: string } } = {};
  const sumScore = data.items.reduce((acc, item) => {
    if (!item?.type) {
      return acc;
    }

    if (item.type === ElementType.Subscale) {
      const calculatedNestedSubscale = calcScores(
        subscalesObject[item.name],
        activityItems,
        subscalesObject,
      )[item.name];

      result[item.name] = calculatedNestedSubscale;

      return acc + calculatedNestedSubscale.score;
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
      const min = Number(typedOptions.minValue);
      const max = Number(typedOptions.maxValue);
      const scores = typedOptions.scores;
      const options = createArrayFromMinToMax(min, max);

      value = scores[options.findIndex((item) => item === answer.value)] || 0;
    }

    return acc + value;
  }, 0);

  const calculatedScore = getSubScaleScore(sumScore, data.scoring, data.items.length);

  if (data?.subscaleTableData) {
    const subscaleTableDataItem = data.subscaleTableData?.find(({ sex, age, rawScore }) => {
      const genderAnswer = activityItems[LookupTableItems.Gender_screen]
        ?.answer as DecryptedSingleSelectionAnswer;
      const withSex = sex ? parseSex(sex) === genderAnswer?.value : true;
      const withAge = age
        ? String(age) ===
          (activityItems[LookupTableItems.Age_screen]?.answer as DecryptedTextAnswer)
        : true;

      return withSex && withAge && rawScore === String(calculatedScore);
    });

    return {
      ...result,
      [data.name]: {
        score: Number(subscaleTableDataItem?.score) || calculatedScore,
        optionText: subscaleTableDataItem?.optionalText || '',
      },
    };
  }

  return { ...result, [data.name]: { score: calculatedScore, optionText: '' } };
};

export const calcTotalScore = (
  subscaleSetting: SubscaleSetting,
  activityItems: Record<string, { activityItem: Item; answer: AnswerDTO }>,
) => {
  if (!subscaleSetting?.calculateTotalScore) return {};

  return calcScores(
    {
      name: FinalSubscale.Key,
      items: Object.keys(activityItems).map((item) => ({ name: item, type: ElementType.Item })),
      scoring: subscaleSetting.calculateTotalScore,
      subscaleTableData: subscaleSetting.totalScoresTableData,
    } as ActivitySettingsSubscale,
    activityItems,
    {},
  );
};

export const getSubscales = (
  subscaleSetting: SubscaleSetting,
  activityItems: Record<string, { activityItem: Item; answer: AnswerDTO }>,
) => {
  if (!subscaleSetting?.subscales?.length) return {};

  const subscalesObject = getObjectFromList<ActivitySettingsSubscale>(
    subscaleSetting.subscales,
    (item) => item.name,
  );

  const parsedSubscales = subscaleSetting.subscales.reduce((acc: ParsedSubscale, item) => {
    const calculatedSubscale = calcScores(item, activityItems, subscalesObject);

    acc[item.name] = calculatedSubscale[item.name].score;
    if (calculatedSubscale?.[item.name]?.optionText) {
      acc[`Optional text for ${item.name}`] = calculatedSubscale[item.name].optionText;
    }

    return acc;
  }, {});

  const calculatedTotalScore = calcTotalScore(subscaleSetting, activityItems);

  return {
    ...(calculatedTotalScore && {
      [FinalSubscale.FinalSubScaleScore]: calculatedTotalScore[FinalSubscale.Key].score,
      [FinalSubscale.OptionalTextForFinalSubScaleScore]:
        calculatedTotalScore[FinalSubscale.Key].optionText,
    }),
    ...parsedSubscales,
  };
};
