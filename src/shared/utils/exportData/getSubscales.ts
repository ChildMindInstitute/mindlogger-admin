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
  subscalesSum: number,
  type: SubscaleTotalScore,
  length: number,
) => {
  if (type === SubscaleTotalScore.Average && length === 0) return 0;

  return type === SubscaleTotalScore.Sum ? subscalesSum : getRoundTo2Decimal(subscalesSum / length);
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

  // TODO: Remove `treatNullAsZero`, `nullScore` when feature flag is removed
  // https://mindlogger.atlassian.net/browse/M2-8635
  const treatNullAsZero = !flags.enableSubscaleNullWhenSkipped;
  const nullScore = treatNullAsZero ? 0 : null;

  const sumScore = data.items.reduce((acc, item) => {
    const activityItem = activityItems[item.name];

    const isSkipped =
      item.type === ElementType.Item &&
      (activityItem?.activityItem.isHidden ||
        activityItem?.answer === null ||
        activityItem?.answer === undefined);

    if (!isSystemItem(item) && !isSkipped) {
      itemCount++;
    }

    if (!item.type || isSkipped) {
      return acc;
    }

    if (item.type === ElementType.Subscale) {
      const calculatedNestedSubscale = calcScores(
        subscalesObject[item.name],
        activityItems,
        subscalesObject,
        flags,
        result,
      )[item.name];

      if (typeof calculatedNestedSubscale?.score === 'number') {
        result[item.name] = calculatedNestedSubscale;

        return (acc ?? 0) + calculatedNestedSubscale.score;
      }

      return acc;
    }

    const answer = activityItem?.answer as
      | undefined
      | DecryptedMultiSelectionAnswer
      | DecryptedSingleSelectionAnswer
      | DecryptedSliderAnswer;
    const typedOptions = activityItem?.activityItem
      .responseValues as SingleAndMultipleSelectItemResponseValues & SliderItemResponseValues;
    let value = 0;

    if (typedOptions?.options?.length) {
      const scoresObject = typedOptions.options?.reduce((acc: ScoresObject, item) => {
        if (item?.value !== undefined && item?.score !== undefined) {
          acc[item.value as keyof ScoresObject] = item.score;
        }

        return acc;
      }, {});

      if (Array.isArray(answer?.value)) {
        value = answer?.value?.reduce((res: number, item) => res + scoresObject[item], 0) || 0;
      } else {
        value = (answer && scoresObject[answer?.value]) || 0;
      }
    }

    if (typedOptions?.scores?.length) {
      const min = Number(typedOptions.minValue);
      const max = Number(typedOptions.maxValue);
      const scores = typedOptions.scores;
      const options = createArrayFromMinToMax(min, max);

      value = scores[options.findIndex((item) => item === answer?.value)] || 0;
    }

    return (acc ?? 0) + value;
  }, nullScore);

  const calculatedScore =
    sumScore === null ? null : getSubscaleScore(sumScore, data.scoring, itemCount);

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
    const calculatedSubscale = calcScores(
      item,
      activityItems,
      subscalesObject,
      flags.enableSubscaleNullWhenSkipped,
    );
    const cleanedName = cleanName(item.name);

    if (flags.enableDataExportRenaming) {
      acc[`subscale_name_${cleanedName}`] = calculatedSubscale[item.name].score;
      if (calculatedSubscale?.[item.name]?.optionText) {
        acc[`subscale_lookup_text_${cleanedName}`] = calculatedSubscale[item.name].optionText;
      }
    } else {
      acc[item.name] = calculatedSubscale[item.name].score;
      if (calculatedSubscale?.[item.name]?.optionText) {
        acc[`Optional text for ${item.name}`] = calculatedSubscale[item.name].optionText;
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
