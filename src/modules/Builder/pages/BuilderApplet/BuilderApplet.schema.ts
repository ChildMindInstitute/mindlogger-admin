import * as yup from 'yup';
import get from 'lodash/get';

import i18n from 'i18n';
import {
  getEntityKey,
  getIsRequiredValidateMessage,
  getMaxLengthValidationError,
} from 'shared/utils';
import {
  ItemResponseType,
  MAX_DESCRIPTION_LENGTH,
  MAX_LENGTH_OF_TEST,
  MAX_NAME_LENGTH,
  MAX_NUMBER_OF_TRIALS,
  MAX_SELECT_OPTION_TEXT_LENGTH,
  MAX_SLIDER_LABEL_TEXT_LENGTH,
  MAX_SLOPE,
  MIN_LENGTH_OF_TEST,
  MIN_NUMBER_OF_TRIALS,
  MIN_SLOPE,
} from 'shared/consts';
import {
  AppletFormValues,
  FlankerItemNames,
  GyroscopeItemNames,
  RoundTypeEnum,
  TouchItemNames,
} from 'modules/Builder/types';
import { Condition, Config, Item } from 'shared/state';
import {
  ItemConfigurationSettings,
  SLIDER_LABEL_MAX_LENGTH,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration';

import {
  checkRawScoreRegexp,
  checkScoreRegexp,
  getRegexForIndexedField,
  getTestFunctionForSubscaleScore,
  isPerfTaskResponseType,
  isTouchOrGyroscopeRespType,
  testFunctionForNotSupportedItems,
  testFunctionForSkippedItems,
  testFunctionForSubscaleAge,
  testFunctionForTheSameVariable,
  testFunctionForUniqueness,
  testIsReportCommonFieldsRequired,
} from './BuilderApplet.utils';
import {
  CONDITION_TYPES_TO_HAVE_OPTION_ID,
  ItemTestFunctions,
  alphanumericAndHyphenRegexp,
} from './BuilderApplet.const';

const { t } = i18n;

export const ResponseValuesSliderRowsSchema = () =>
  yup.array().of(
    yup.object({
      minLabel: yup.string().max(MAX_SLIDER_LABEL_TEXT_LENGTH, getMaxLengthValidationError),
      maxLabel: yup.string().max(MAX_SLIDER_LABEL_TEXT_LENGTH, getMaxLengthValidationError),
      label: yup
        .string()
        .required(getIsRequiredValidateMessage('sliderLabel'))
        .max(SLIDER_LABEL_MAX_LENGTH, getMaxLengthValidationError),
    }),
  );

export const ResponseValuesSliderSchema = () => ({
  minLabel: yup.string().max(MAX_SLIDER_LABEL_TEXT_LENGTH, getMaxLengthValidationError),
  maxLabel: yup.string().max(MAX_SLIDER_LABEL_TEXT_LENGTH, getMaxLengthValidationError),
});

export const ResponseValuesSelectionRowsSchema = () =>
  yup.object({
    rowName: yup.string().required(({ path }) => {
      const matchedIndex = path?.match(getRegexForIndexedField('rowName'))?.at(-1) ?? '';

      return getIsRequiredValidateMessage('row', {
        context: 'indexed',
        index: `${+matchedIndex + 1}`,
      });
    }),
  });

export const ResponseValuesSelectionOptionsSchema = () =>
  yup.object({
    text: yup.string().required(({ path }) => {
      const matchedIndex = path?.match(getRegexForIndexedField('text'))?.at(-1) ?? '';

      return getIsRequiredValidateMessage('option', {
        context: 'indexed',
        index: `${+matchedIndex + 1}`,
      });
    }),
  });

export const ResponseValuesOptionsSchema = () =>
  yup.array().of(
    yup.object({
      text: yup
        .string()
        .required(getIsRequiredValidateMessage('optionText'))
        .max(MAX_SELECT_OPTION_TEXT_LENGTH, getMaxLengthValidationError),
    }),
  );

export const ResponseValuesAudio = () => ({
  maxDuration: yup.number(),
});

export const ResponseValuesAudioPlayer = () => ({
  file: yup.string().required(getIsRequiredValidateMessage('audio')),
});

export const ResponseValuesNumberSelectionSchema = () => ({
  minValue: yup
    .number()
    .when('maxValue', (maxValue, schema) =>
      schema.lessThan(
        maxValue,
        t('validationMessages.lessThan', { less: t('minValue'), than: t('maxValue') }),
      ),
    ),
});

const getFlankerButtonsSchema = (type: 'name' | 'image') =>
  yup
    .string()
    .test(
      'has-image-or-name',
      type === 'name' ? getIsRequiredValidateMessage('flankerButtons.nameOrImage') : '',
      function () {
        const { image, text } = this.parent;

        return !(!image && !text);
      },
    )
    .nullable();

export const getFlankerGeneralSchema = (
  schema: yup.SchemaOf<AppletFormValues>,
  type: RoundTypeEnum,
) => {
  const isPractice = type === RoundTypeEnum.Practice;

  return schema.shape({
    trialDuration: yup.number().required(getIsRequiredValidateMessage('positiveInteger')),
    blocks: yup.array().required().min(1),
    ...(isPractice && {
      stimulusTrials: yup
        .array()
        .of(
          yup.object({
            image: yup.string().required(),
          }),
        )
        .min(1),
      buttons: yup.array().of(
        yup.object({
          text: getFlankerButtonsSchema('name'),
          image: getFlankerButtonsSchema('image'),
        }),
      ),
      fixationScreen: yup
        .object()
        .when('showFixation', (showFixation, schema) => {
          if (!showFixation) return schema;

          return schema.shape({
            image: yup.string().required(),
          });
        })
        .nullable(),
      fixationDuration: yup
        .number()
        .when('showFixation', (showFixation, schema) => {
          if (!showFixation) return schema;

          return schema.required(getIsRequiredValidateMessage('positiveInteger'));
        })
        .nullable(),
      minimumAccuracy: yup
        .number()
        .required(getIsRequiredValidateMessage('integerBetweenOneAndHundred')),
    }),
  });
};

export const GyroscopeAndTouchConfigSchema = () => ({
  general: yup.object({
    trialsNumber: yup
      .number()
      .min(MIN_NUMBER_OF_TRIALS, <string>t('integerError'))
      .max(MAX_NUMBER_OF_TRIALS, <string>t('integerError')),
    durationMinutes: yup
      .number()
      .min(MIN_LENGTH_OF_TEST, <string>t('integerError'))
      .max(MAX_LENGTH_OF_TEST, <string>t('integerError')),
    lambdaSlope: yup
      .number()
      .min(MIN_SLOPE, <string>t('integerError'))
      .max(MAX_SLOPE, <string>t('integerError')),
  }),
});

export const ItemSchema = () =>
  yup
    .object({
      name: yup
        .string()
        .required(getIsRequiredValidateMessage('itemName'))
        .matches(alphanumericAndHyphenRegexp, {
          message: t('validationMessages.alphanumericAndHyphen', { field: t('itemName') }),
        })
        .test(
          ItemTestFunctions.UniqueItemName,
          t('validationMessages.unique', { field: t('itemName') }) as string,
          (itemName, context) => testFunctionForUniqueness('items', itemName ?? '', context),
        ),
      responseType: yup.string().required(getIsRequiredValidateMessage('itemType')),
      question: yup
        .string()
        .when('responseType', (responseType, schema) => {
          if (isPerfTaskResponseType(responseType)) {
            return schema;
          }

          return schema.when('name', (name: string, schema: yup.SchemaOf<AppletFormValues>) => {
            if (
              name === GyroscopeItemNames.GeneralInstruction ||
              name === TouchItemNames.GeneralInstruction ||
              name === FlankerItemNames.GeneralInstruction
            ) {
              return schema.required(getIsRequiredValidateMessage('overviewInstruction'));
            }

            if (
              name === GyroscopeItemNames.PracticeInstruction ||
              name === TouchItemNames.PracticeInstruction ||
              name === FlankerItemNames.PracticeInstructionFirst
            ) {
              return schema.required(getIsRequiredValidateMessage('practiceInstruction'));
            }

            if (
              name === GyroscopeItemNames.TestInstruction ||
              name === TouchItemNames.TestInstruction ||
              name === FlankerItemNames.TestInstructionFirst
            ) {
              return schema.required(getIsRequiredValidateMessage('testInstruction'));
            }

            return schema.required(getIsRequiredValidateMessage('displayedContent'));
          });
        })
        .test(
          ItemTestFunctions.VariableInTheSameItem,
          t('validationMessages.variableInTheSameItem') as string,
          (itemName, context) =>
            testFunctionForTheSameVariable('question', itemName ?? '', context),
        )
        .test(
          ItemTestFunctions.VariableIsNotSupported,
          t('validationMessages.variableIsNotSupported') as string,
          (itemName, context) =>
            testFunctionForNotSupportedItems('question', itemName ?? '', context),
        )
        .test(
          ItemTestFunctions.VariableReferringToSkippedItem,
          t('validationMessages.variableReferringToSkippedItem') as string,
          (itemName, context) => testFunctionForSkippedItems('question', itemName ?? '', context),
        ),
      responseValues: yup.object({}).when('responseType', (responseType, schema) => {
        if (
          responseType === ItemResponseType.SingleSelection ||
          responseType === ItemResponseType.MultipleSelection
        )
          return schema.shape({ options: ResponseValuesOptionsSchema() });

        if (responseType === ItemResponseType.NumberSelection)
          return schema.shape(ResponseValuesNumberSelectionSchema());

        if (responseType === ItemResponseType.Slider)
          return schema.shape(ResponseValuesSliderSchema());

        if (
          responseType === ItemResponseType.SingleSelectionPerRow ||
          responseType === ItemResponseType.MultipleSelectionPerRow
        ) {
          return schema.shape({
            rows: yup.array().of(ResponseValuesSelectionRowsSchema()),
            options: yup.array().of(ResponseValuesSelectionOptionsSchema()),
          });
        }

        if (responseType === ItemResponseType.AudioPlayer)
          return schema.shape(ResponseValuesAudioPlayer());

        if (responseType === ItemResponseType.Audio) return schema.shape(ResponseValuesAudio());

        if (responseType === ItemResponseType.SliderRows)
          return schema.shape({ rows: ResponseValuesSliderRowsSchema() });

        return schema.nullable();
      }),
      alerts: yup
        .array()
        .when('responseType', (responseType, schema) => {
          if (
            responseType === ItemResponseType.SingleSelection ||
            responseType === ItemResponseType.MultipleSelection
          )
            return schema.of(
              yup.object({
                value: yup.string().required(''),
                alert: yup.string().required(getIsRequiredValidateMessage('alertMessage')),
              }),
            );

          if (responseType === ItemResponseType.Slider) {
            return schema.of(
              yup.object({
                value: yup.number().required(''),
                alert: yup.string().required(getIsRequiredValidateMessage('alertMessage')),
              }),
            );
          }

          if (
            responseType === ItemResponseType.SingleSelectionPerRow ||
            responseType === ItemResponseType.MultipleSelectionPerRow
          ) {
            return schema.of(
              yup.object({
                optionId: yup.string().required(''),
                rowId: yup.string().required(''),
                alert: yup.string().required(getIsRequiredValidateMessage('alertMessage')),
              }),
            );
          }

          if (responseType === ItemResponseType.SliderRows) {
            return schema.of(
              yup.object({
                value: yup.string().required(''),
                sliderId: yup.string().required(''),
                alert: yup.string().required(getIsRequiredValidateMessage('alertMessage')),
              }),
            );
          }

          return schema;
        })
        .when(['responseType', 'config'], {
          is: (responseType: ItemResponseType, config: Config) =>
            responseType === ItemResponseType.Slider &&
            get(config, ItemConfigurationSettings.IsContinuous),
          then: (schema) =>
            schema.of(
              yup.object({
                minValue: yup.number().required(''),
                maxValue: yup.number().required(''),
                alert: yup.string().required(getIsRequiredValidateMessage('alertMessage')),
              }),
            ),
          otherwise: (schema) => schema,
        }),
      config: yup.object({}).when('responseType', (responseType, schema) => {
        if (isTouchOrGyroscopeRespType(responseType)) {
          return schema.shape(GyroscopeAndTouchConfigSchema());
        }

        if (responseType === ItemResponseType.Flanker) {
          return schema.when('name', (name: string, schema: yup.SchemaOf<AppletFormValues>) => {
            if (name === FlankerItemNames.PracticeFirst) {
              return getFlankerGeneralSchema(schema, RoundTypeEnum.Practice);
            }

            if (name === FlankerItemNames.TestFirst) {
              return getFlankerGeneralSchema(schema, RoundTypeEnum.Test);
            }

            return schema;
          });
        }

        return schema.shape({
          correctAnswerRequired: yup.boolean().nullable(),
          correctAnswer: yup
            .string()
            .nullable()
            .when('correctAnswerRequired', (correctAnswerRequired, schema) =>
              correctAnswerRequired
                ? schema.required(getIsRequiredValidateMessage('correctAnswer'))
                : schema,
            ),
        });
      }),
    })
    .required();

const rawScoreSchema = yup
  .string()
  .required()
  .test('subscale-rawScore-validator', getTestFunctionForSubscaleScore(checkRawScoreRegexp));
const optionalTextSchema = yup.string().nullable();
const SubscaleTableDataItemSchema = () =>
  yup
    .object({
      score: yup
        .string()
        .required()
        .test('subscale-score-validator', getTestFunctionForSubscaleScore(checkScoreRegexp)),
      rawScore: rawScoreSchema,
      age: yup
        .string()
        .nullable()
        .test('subscale-age-validator', (age) => testFunctionForSubscaleAge('age', age)),
      sex: yup
        .string()
        .nullable()
        .matches(/^[MF]?$/),
      optionalText: optionalTextSchema,
    })
    .noUnknown()
    .required();

const TotalScoreTableDataItemSchema = () =>
  yup
    .object({
      rawScore: rawScoreSchema,
      optionalText: optionalTextSchema,
    })
    .noUnknown();

export const SubscaleTableDataSchema = yup.array().of(SubscaleTableDataItemSchema()).nullable();

export const SubscaleSchema = () =>
  yup
    .object({
      name: yup
        .string()
        .required(getIsRequiredValidateMessage('subscaleName'))
        .test(
          'unique-subscale-name',
          t('validationMessages.unique', { field: t('subscaleName') }) as string,
          (subscaleName, context) =>
            testFunctionForUniqueness('subscales', subscaleName ?? '', context),
        ),
      items: yup.array().min(1, t('validationMessages.atLeastOne') as string),
      scoring: yup.string(),
      subscaleTableData: SubscaleTableDataSchema,
    })
    .required();

export const ConditionSchema = () =>
  yup.object({
    itemName: yup.string().required(getIsRequiredValidateMessage('conditionItem')),
    type: yup.string().required(getIsRequiredValidateMessage('conditionType')),
    payload: yup.object({}).when('type', (type, schema) => {
      if (!type || CONDITION_TYPES_TO_HAVE_OPTION_ID.includes(type))
        return schema.shape({
          optionValue: yup.string().required(getIsRequiredValidateMessage('conditionValue')),
        });

      return schema;
    }),
  });

export const ConditionalLogicSchema = () =>
  yup.object({
    match: yup.string().required(getIsRequiredValidateMessage('conditionMatch')),
    itemKey: yup
      .string()
      .required(getIsRequiredValidateMessage('conditionTarget'))
      .test(
        'item-flow-contradiction',
        t('appletHasItemFlowContradictions') as string,
        (itemKey, context) => {
          const items = get(context, 'from.1.value.items');
          const conditions = get(context, 'parent.conditions');
          const itemIds = items?.map((item: Item) => getEntityKey(item));
          const itemIndex = itemIds?.findIndex((id: string) => id === itemKey);
          const itemsBefore = itemIds?.slice(0, itemIndex + 1);

          return !conditions?.some(
            ({ itemName }: Condition) => itemName && !itemsBefore.includes(itemName),
          );
        },
      ),
    conditions: yup.array().of(ConditionSchema()),
  });

const getReportCommonFields = (isScoreReport = false) => ({
  showMessage: yup.boolean(),
  printItems: yup.boolean().when('showMessage', {
    is: false,
    then: yup
      .boolean()
      .test(
        'required-report-common-fields',
        <string>t('validationMessages.mustShowMessageOrItems'),
        (printItemsName, context) =>
          testIsReportCommonFieldsRequired(isScoreReport, !!printItemsName, context),
      ),
  }),
  message: yup
    .string()
    .when('showMessage', {
      is: true,
      then: yup.string().required(getIsRequiredValidateMessage('message')),
    })
    .nullable(),
  itemsPrint: yup.array().when('printItems', {
    is: true,
    then: yup
      .array()
      .min(1, <string>t('validationMessages.atLeastOneItem'))
      .nullable(),
  }),
});

export const ScoreConditionalLogic = () =>
  yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .required(getIsRequiredValidateMessage('scoreConditionName'))
      .test(
        'unique-score-conditional-name',
        t('validationMessages.unique', { field: t('scoreConditionName') }) as string,
        (scoreConditionName, context) =>
          testFunctionForUniqueness('conditionalLogic', scoreConditionName ?? '', context),
      ),
    conditions: yup
      .array()
      .of(ConditionSchema())
      .min(1, <string>t('validationMessages.atLeastOneCondition')),
    flagScore: yup.boolean(),
    ...getReportCommonFields(),
    match: yup.string(),
  });

export const ScoreSchema = () =>
  yup.object({
    id: yup.string().required(),
    name: yup
      .string()
      .required(getIsRequiredValidateMessage('scoreName'))
      .test(
        'unique-score-name',
        t('validationMessages.unique', { field: t('scoreName') }) as string,
        (scoreName, context) => testFunctionForUniqueness('scores', scoreName ?? '', context),
      ),
    calculationType: yup.string().required(),
    ...getReportCommonFields(true),
    itemsScore: yup.array().min(1, <string>t('validationMessages.atLeastOneItem')),
    conditionalLogic: yup.array().of(ScoreConditionalLogic()).nullable(),
  });

export const SectionConditionalLogic = () =>
  yup.object({
    id: yup.string(),
    name: yup.string(),
    conditions: yup
      .array()
      .of(ConditionSchema())
      .min(1, <string>t('validationMessages.atLeastOneCondition')),
    match: yup.string(),
  });

export const TotalScoresTableDataSchema = yup
  .array()
  .of(TotalScoreTableDataItemSchema())
  .nullable();

export const SectionSchema = () =>
  yup.object({
    name: yup
      .string()
      .required(getIsRequiredValidateMessage('sectionName'))
      .matches(alphanumericAndHyphenRegexp, {
        message: t('validationMessages.alphanumericAndHyphen', { field: t('sectionName') }),
      })
      .test(
        'unique-section-name',
        t('validationMessages.unique', { field: t('sectionName') }) as string,
        (sectionName, context) => testFunctionForUniqueness('sections', sectionName ?? '', context),
      ),
    ...getReportCommonFields(),
    conditionalLogic: SectionConditionalLogic().nullable(),
  });

export const ActivitySchema = () =>
  yup.object({
    name: yup
      .string()
      .required(getIsRequiredValidateMessage('activityName'))
      .test(
        'unique-activity-name',
        t('validationMessages.unique', { field: t('activityName') }) as string,
        (activityName, context) =>
          testFunctionForUniqueness('activities', activityName ?? '', context),
      ),
    description: yup.string(),
    image: yup.string(),
    splashScreen: yup.string(),
    showAllAtOnce: yup.boolean(),
    isSkippable: yup.boolean(),
    isReviewable: yup.boolean(),
    responseIsEditable: yup.boolean(),
    items: yup.array().of(ItemSchema()).min(1),
    isHidden: yup.boolean(),
    subscaleSetting: yup
      .object({
        calculateTotalScore: yup.string().nullable(),
        subscales: yup.array().of(SubscaleSchema()),
        totalScoresTableData: yup.array().of(TotalScoreTableDataItemSchema()).nullable(),
      })
      .nullable(),
    conditionalLogic: yup.array().of(ConditionalLogicSchema()),
    scoresAndReports: yup
      .object({
        generateReport: yup.boolean(),
        showScoreSummary: yup.boolean(),
        scores: yup.array().of(ScoreSchema()),
        sections: yup.array().of(SectionSchema()),
      })
      .nullable(),
  });

export const ActivityFlowItemSchema = () =>
  yup
    .object({
      activityKey: yup.string(),
    })
    .required();

export const ActivityFlowSchema = () =>
  yup
    .object({
      name: yup
        .string()
        .required(getIsRequiredValidateMessage('activityFlowName'))
        .max(MAX_NAME_LENGTH, getMaxLengthValidationError)
        .test(
          'unique-activity-flow-name',
          t('validationMessages.unique', { field: t('activityFlowName') }) as string,
          (activityFlowName, context) =>
            testFunctionForUniqueness('activityFlows', activityFlowName ?? '', context),
        ),
      description: yup
        .string()
        .required(getIsRequiredValidateMessage('activityFlowDescription'))
        .max(MAX_DESCRIPTION_LENGTH, getMaxLengthValidationError),
      isSingleReport: yup.boolean(),
      hideBadge: yup.boolean(),
      items: yup.array().of(ActivityFlowItemSchema()).min(1),
      isHidden: yup.boolean(),
    })
    .required();

export const AppletSchema = () =>
  yup.object({
    displayName: yup.string().required(getIsRequiredValidateMessage('appletName')),
    description: yup.string(),
    themeId: yup.string().nullable(),
    about: yup.string(),
    image: yup.string(),
    watermark: yup.string(),
    activities: yup.array().of(ActivitySchema()).min(1),
    activityFlows: yup.array().of(ActivityFlowSchema()),
  });
