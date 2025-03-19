import {
  ActivitySettingsSubscale,
  ActivitySettingsSubscaleItem,
  Item,
  ParsedSubscale,
  ScoresObject,
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
  SubscaleSetting,
} from 'shared/state';
import {
  LegacyFinalSubscale,
  FinalSubscale,
  ItemResponseType,
  LookupTableItems,
  Sex,
  SubscaleTotalScore,
} from 'shared/consts';
import {
  AnswerDTO,
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
  ElementType,
} from 'shared/types';
import { CalculatedSubscaleScores } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Subscales/Subscales.types';
import { FeatureFlags } from 'shared/types/featureFlags';

import { createArrayFromMinToMax } from '../array';
import { isSystemItem } from '../isSystemItem';
import { getObjectFromList } from '../getObjectFromList';

const getRoundTo2Decimal = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

export const getSubscaleScore = (
  subscalesSum: number | null,
  type: SubscaleTotalScore,
  length: number,
  maxScore: number,
) => {
  if (subscalesSum === null) return null;

  switch (type) {
    case SubscaleTotalScore.Sum:
      return subscalesSum;
    case SubscaleTotalScore.Average:
      return length === 0 ? 0 : getRoundTo2Decimal(subscalesSum / length);
    case SubscaleTotalScore.Percentage:
      return maxScore === 0 ? 0 : getRoundTo2Decimal((subscalesSum * 100) / maxScore);
    default:
      return 0;
  }
};

export const parseSex = (sex: string) => (sex === Sex.M ? '0' : '1');

export const INTERVAL_SYMBOL = '~';

export const calcScores = <T>(
  data: ActivitySettingsSubscale,
  activityItems: Record<string, T & { answer: AnswerDTO; activityItem: Item }>,
  subscalesObject: Record<string, ActivitySettingsSubscale>,
  flags: FeatureFlags,
  result: CalculatedSubscaleScores = {},
): CalculatedSubscaleScores => {
  let itemCount = 0;
  let maxScore = 0;

  // TODO: Remove this when feature flag is removed
  // https://mindlogger.atlassian.net/browse/M2-8635
  const defaultScore = flags.enableSubscaleNullWhenSkipped ? null : 0;

  const sumScore = data.items.reduce((acc, item) => {
    if (!item.type) return acc;

    /* Handle nested subscales
    =================================================== */
    if (item.type === ElementType.Subscale) {
      itemCount++;

      const calculatedNestedSubscale = calcScores(
        subscalesObject[item.name],
        activityItems,
        subscalesObject,
        flags,
        result,
      )[item.name];

      if (typeof calculatedNestedSubscale?.score === 'number') {
        result[item.name] = calculatedNestedSubscale;
        maxScore += calculatedNestedSubscale.score;

        return (acc ?? 0) + calculatedNestedSubscale.score;
      }

      return acc;
    }

    /* Handle activity items
    =================================================== */
    const activityItem = activityItems[item.name];

    // Both system and hidden items are skipped and do not influence scoring.
    if (isSystemItem(item) || activityItem?.activityItem.isHidden) {
      return acc;
    }

    const answer = activityItem?.answer as
      | undefined
      | DecryptedMultiSelectionAnswer
      | DecryptedSingleSelectionAnswer
      | DecryptedSliderAnswer;
    const typedOptions = activityItem?.activityItem.responseValues as
      | SingleAndMultipleSelectItemResponseValues
      | SliderItemResponseValues;

    let value: number | null = null;

    if (typedOptions) {
      if ('options' in typedOptions && typedOptions.options.length) {
        // Single & Multiple Select
        const scoresObject = typedOptions.options.reduce((acc: ScoresObject, item) => {
          if (item.value !== undefined && item.score !== undefined) {
            acc[item.value as keyof ScoresObject] = item.score;
          }

          return acc;
        }, {});

        if ('type' in typedOptions && typedOptions.type === 'singleSelect') {
          maxScore += Math.max(...Object.values(scoresObject));
        } else {
          maxScore += Object.values(scoresObject).reduce((acc, result) => acc + result, 0);
        }

        if (Array.isArray(answer?.value)) {
          value =
            answer?.value.reduce((result: null | number, val) => {
              if (scoresObject[val] === null) return result;

              return (result ?? 0) + scoresObject[val];
            }, null) ?? null;
        } else {
          value = (answer && scoresObject[answer.value]) ?? null;
        }
      } else if ('scores' in typedOptions && typedOptions.scores?.length) {
        // Slider
        const min = Number(typedOptions.minValue);
        const max = Number(typedOptions.maxValue);
        const scores = typedOptions.scores;
        const options = createArrayFromMinToMax(min, max);
        maxScore += Math.max(...scores);

        value = scores[options.findIndex((item) => item === answer?.value)] ?? null;
      }
    }

    // New feature-flagged behaviour also treats skipped responses as null.
    // TODO: When feature flag is removed, logic can be simplified.
    // https://mindlogger.atlassian.net/browse/M2-8635
    if (value === null) {
      if (flags.enableSubscaleNullWhenSkipped) {
        return acc;
      } else {
        value = 0;
      }
    }

    itemCount++;

    return (acc ?? 0) + value;
  }, defaultScore);

  const calculatedScore = getSubscaleScore(sumScore, data.scoring, itemCount, maxScore);

  if (calculatedScore !== null && data?.subscaleTableData) {
    const subscaleTableDataItem = data.subscaleTableData?.find(({ sex, age, rawScore }) => {
      const genderAnswer = activityItems[LookupTableItems.Gender_screen]
        ?.answer as DecryptedSingleSelectionAnswer;
      const withSex = !sex || parseSex(sex) === String(genderAnswer?.value);

      const ageAnswer = activityItems[LookupTableItems.Age_screen]?.answer;
      let reportedAge: string | undefined;

      if (ageAnswer) {
        if (typeof ageAnswer === 'string') {
          reportedAge = ageAnswer;
        } else if ('value' in ageAnswer && ['number', 'string'].includes(typeof ageAnswer.value)) {
          reportedAge = String(ageAnswer.value);
        }
      }

      const hasAgeInterval = age && typeof age === 'string' && age.includes(INTERVAL_SYMBOL);
      let withAge = true;

      if (age) {
        if (!hasAgeInterval) {
          withAge = String(age) === reportedAge;
        } else {
          const [minAge, maxAge] = age.replace(/\s/g, '').split(INTERVAL_SYMBOL);
          const reportedAgeNum = Number(reportedAge);
          withAge = Number(minAge) <= reportedAgeNum && reportedAgeNum <= Number(maxAge);
        }
      }

      if (!withSex || !withAge) return false;

      const hasInterval = rawScore.includes(INTERVAL_SYMBOL);
      if (!hasInterval) return rawScore === String(calculatedScore);

      const [minScore, maxScore] = rawScore.replace(/\s/g, '').split(INTERVAL_SYMBOL);

      return Number(minScore) <= calculatedScore && calculatedScore <= Number(maxScore);
    });

    return {
      ...result,
      [data.name]: {
        score: Number(subscaleTableDataItem?.score) || getRoundTo2Decimal(calculatedScore),
        optionText: subscaleTableDataItem?.optionalText || '',
        severity: subscaleTableDataItem?.severity || null,
      },
    };
  }

  return {
    ...result,
    ...(typeof calculatedScore === 'number' && {
      [data.name]: { score: getRoundTo2Decimal(calculatedScore), optionText: '', severity: null },
    }),
  };
};

export const calcTotalScore = (
  subscaleSetting: SubscaleSetting,
  activityItems: Record<string, { activityItem: Item; answer: AnswerDTO }>,
  flags: FeatureFlags,
) => {
  if (!subscaleSetting?.calculateTotalScore) return {};

  return calcScores(
    {
      name: flags.enableDataExportRenaming ? FinalSubscale.Key : LegacyFinalSubscale.Key,
      items: Object.keys(activityItems).reduce((acc: ActivitySettingsSubscaleItem[], item) => {
        const itemType = activityItems[item].activityItem.responseType;
        const allowEdit = activityItems[item].activityItem.allowEdit;

        if (
          itemType === ItemResponseType.SingleSelection ||
          itemType === ItemResponseType.MultipleSelection ||
          itemType === ItemResponseType.Slider
        ) {
          acc.push({
            name: item,
            type: ElementType.Item,
            allowEdit,
          });
        }

        return acc;
      }, []),
      scoring: subscaleSetting.calculateTotalScore,
      subscaleTableData: subscaleSetting.totalScoresTableData,
    } as ActivitySettingsSubscale,
    activityItems,
    {},
    flags,
  );
};

export const getSubscales = (
  subscaleSetting: SubscaleSetting,
  activityItems: Record<string, { activityItem: Item; answer: AnswerDTO }>,
  flags: FeatureFlags,
) => {
  if (!subscaleSetting?.subscales?.length || !Object.keys(activityItems).length) return {};

  const subscalesObject = getObjectFromList<ActivitySettingsSubscale>(
    subscaleSetting.subscales,
    (item) => item.name,
  );

  const cleanName = (name: string) => name.replace(/[^a-zA-Z0-9-]/g, '_');

  const parsedSubscales = subscaleSetting.subscales.reduce((acc: ParsedSubscale, item) => {
    const calculatedSubscale = calcScores(item, activityItems, subscalesObject, flags)[item.name];
    if (!calculatedSubscale) return acc;

    const cleanedName = cleanName(item.name);

    if (flags.enableDataExportRenaming) {
      acc[`subscale_name_${cleanedName}`] = calculatedSubscale?.score;
      if (calculatedSubscale?.optionText) {
        acc[`subscale_lookup_text_${cleanedName}`] = calculatedSubscale.optionText;
      }
    } else {
      acc[item.name] = calculatedSubscale?.score;
      if (calculatedSubscale?.optionText) {
        acc[`Optional text for ${item.name}`] = calculatedSubscale.optionText;
      }
    }

    return acc;
  }, {});

  const result =
    subscaleSetting.calculateTotalScore && calcTotalScore(subscaleSetting, activityItems, flags);

  const finalSubscale = flags.enableDataExportRenaming ? FinalSubscale : LegacyFinalSubscale;

  const calculatedTotalScore = result?.[finalSubscale.Key];

  return {
    ...(typeof calculatedTotalScore?.score === 'number' && {
      [finalSubscale.FinalSubScaleScore]: calculatedTotalScore.score,
      [finalSubscale.OptionalTextForFinalSubScaleScore]: calculatedTotalScore.optionText,
    }),
    ...parsedSubscales,
  };
};
