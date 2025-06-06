import get from 'lodash/get';
import * as yup from 'yup';

import i18n from 'i18n';
import { DEFAULT_NUMBER_SELECT_MIN_VALUE } from 'modules/Builder/consts';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import { RoundTypeEnum } from 'modules/Builder/types';
import {
  CONDITION_TYPES_TO_HAVE_RANGE_VALUE,
  CONDITION_TYPES_TO_HAVE_SINGLE_VALUE,
  ItemResponseType,
  MAX_DESCRIPTION_LENGTH,
  MAX_LENGTH_OF_TEST,
  MAX_NAME_LENGTH,
  MAX_NUMBER_OF_TRIALS,
  MAX_SLOPE,
  MIN_LENGTH_OF_TEST,
  MIN_NUMBER_OF_TRIALS,
  MIN_SLOPE,
  PerfTaskType,
  ScoreReportType,
} from 'shared/consts';
import {
  Condition,
  Config,
  PhrasalTemplateField,
  ScoreOrSection,
  ScoreReportScoringType,
} from 'shared/state';
import {
  createRegexFromList,
  getEntityKey,
  getIsRequiredValidateMessage,
  getMaxLengthValidationError,
  getObjectFromList,
} from 'shared/utils';
import { TScoreSeverity } from 'modules/Builder/features/ActivitySettings/SubscalesConfiguration/LookupTable';
import { FeatureFlags } from 'shared/types/featureFlags';

import { ItemFormValues } from '../../types/Builder.types';
import {
  alphanumericAndHyphenRegexp,
  CONDITION_TYPES_TO_HAVE_OPTION_ID,
  IP_ADDRESS_REGEXP,
  ItemTestFunctions,
  PORT_REGEXP,
} from './BuilderApplet.const';
import {
  ageRangeRegexp,
  checkScoreRegexp,
  getCommonSliderValidationProps,
  getConditionsMatch,
  getRegexForIndexedField,
  getSliderAlertValueValidation,
  getTestFunctionForSubscaleScore,
  isNumberAtLeastOne,
  testFunctionForNotExistedItems,
  testFunctionForNotSupportedItems,
  testFunctionForSkippedItems,
  testFunctionForSubscaleAge,
  testFunctionForSystemItems,
  testFunctionForTheSameVariable,
  testFunctionForUniqueness,
  testIsReportCommonFieldsRequired,
} from './BuilderApplet.utils';

const { t } = i18n;

export const ResponseValuesSliderSchema = () => getCommonSliderValidationProps('slider');

export const ResponseValuesSliderRowsSchema = () =>
  yup.array().of(
    yup.object({
      label: yup.string().required(getIsRequiredValidateMessage('sliderLabel')),
      ...getCommonSliderValidationProps('sliderRows'),
    }),
  );

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
      text: yup.string().required(getIsRequiredValidateMessage('optionText')),
    }),
  );

export const ResponseValuesOptionsWithScoreSchema = () =>
  yup.array().of(
    yup.object({
      text: yup.string().required(getIsRequiredValidateMessage('optionText')),
      score: yup
        .number()
        .required(getIsRequiredValidateMessage('score'))
        .min(Number.MIN_SAFE_INTEGER, t('scoreTooLow'))
        .max(Number.MAX_SAFE_INTEGER, t('scoreTooHigh'))
        .test('precision', t('scorePrecisionError'), (number) => {
          const decimalPlaces = number.toString().split('.')[1]?.length ?? 0;

          return decimalPlaces <= 2;
        })
        .typeError(t('scoreMustBeNumber')),
    }),
  );

export const ResponseValuesAudio = () => ({
  maxDuration: yup.mixed().test('is-number', t('positiveIntegerRequired'), isNumberAtLeastOne),
});

export const ResponseValuesAudioPlayer = () => ({
  file: yup.string().required(getIsRequiredValidateMessage('audio')),
});

export const ResponseValuesNumberSelectionSchema = () => ({
  maxValue: yup
    .mixed()
    .test('is-number', t('positiveIntegerRequired'), isNumberAtLeastOne)
    .test('min-max-interval', '', function (value) {
      if (!value && value !== 0) return;
      const { minValue } = this.parent;

      return value > minValue;
    }),
  minValue: yup
    .mixed()
    .test(
      'is-number-at-least-zero',
      t('positiveIntegerOrZeroRequired'),
      (value) => typeof value === 'number' && value >= DEFAULT_NUMBER_SELECT_MIN_VALUE,
    )
    .test(
      'min-max-interval',
      t('validationMessages.lessThan', {
        less: t('minValue'),
        than: t('maxValue'),
      }),
      function (value) {
        if (!value && value !== 0) return;
        const { maxValue } = this.parent;

        return value < maxValue;
      },
    ),
});

export const ResponseValuesRequestHealthRecordDataSchema = () => ({
  optInOutOptions: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        label: yup
          .string()
          .required(getIsRequiredValidateMessage('requestHealthRecordDataSettings.label'))
          .max(75, t('validationMessages.maxCharacters', { count: 75 })),
      }),
    )
    .required()
    .length(2),
});

const flankerImageOrNameValidation = (validateMessage?: string) =>
  yup
    .string()
    .test('has-image-or-name', validateMessage ?? '', function () {
      const { image, text } = this.parent;

      return !(!image && !text);
    })
    .nullable();

const flankerImageOrValueValidation = () =>
  yup
    .string()
    .test('has-image-or-value', '', function () {
      const { image, value } = this.parent;

      return !(!image && !value);
    })
    .nullable();

export const getFlankerGeneralSchema = (
  schema: yup.ObjectSchema<yup.AnyObject>,
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
            image: flankerImageOrNameValidation(),
            text: flankerImageOrNameValidation(),
          }),
        )
        .min(1),
      buttons: yup.array().of(
        yup.object({
          text: flankerImageOrNameValidation(
            getIsRequiredValidateMessage('flankerButtons.nameOrImage'),
          ),
          image: flankerImageOrNameValidation(),
        }),
      ),
      fixationScreen: yup
        .object()
        .when('showFixation', ([showFixation], schema) => {
          if (!showFixation) return schema;

          return schema.shape({
            image: flankerImageOrValueValidation(),
            value: flankerImageOrValueValidation(),
          });
        })
        .nullable(),
      fixationDuration: yup
        .number()
        .when('showFixation', ([showFixation], schema) => {
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

export const PhrasalTemplateResponseValuePhraseFieldSchema = yup.object({
  type: yup.mixed().oneOf(['sentence', 'item_response', 'line_break']).required(),
  text: yup.string().when('type', {
    is: 'sentence',
    then(schema) {
      return schema
        .trim()
        .test(
          'validate there is only one empty sentence',
          t('fieldRequiredAddToContinue'),
          function (value, textContext) {
            const parentPhrasalTemplateResponseValuePhraseSchema = textContext.from?.[1];
            const fields: PhrasalTemplateField[] = parentPhrasalTemplateResponseValuePhraseSchema
              ?.value?.fields || { type: '' };

            const isMoreThanOneSentence =
              fields?.filter(({ type }) => type === 'sentence').length > 1;

            if (!value && !isMoreThanOneSentence) {
              return false;
            }

            return true;
          },
        )
        .test(
          'validate there are more than one empty sentences',
          t('fieldAddContentOrRemove'),
          function (value, textContext) {
            const parentPhrasalTemplateResponseValuePhraseSchema = textContext.from?.[1];
            const fields: PhrasalTemplateField[] = parentPhrasalTemplateResponseValuePhraseSchema
              ?.value?.fields || { type: '' };

            const isMoreThanOneSentence =
              fields?.filter(({ type }) => type === 'sentence').length > 1;

            if (!value && isMoreThanOneSentence) {
              return false;
            }

            return true;
          },
        );
    },
  }),
  itemName: yup.string().when('type', {
    is: 'item_response',
    then: (schema) =>
      schema
        .trim()
        .test(
          'validate item was deleted',
          t('fieldReferenceItemWasDeleted'),
          function (_, textContext) {
            if (textContext.parent.itemName.includes('-deleted')) {
              return false;
            }

            return true;
          },
        )
        .test(
          'validate required only one field',
          t('fieldRequiredMakeASelection'),
          function (value, textContext) {
            const parentPhrasalTemplateResponseValuePhraseSchema = textContext.from?.[1];
            const fields = parentPhrasalTemplateResponseValuePhraseSchema?.value?.fields || {
              type: '',
            };

            const isMoreThanOneItemResponse =
              fields?.filter(({ type }: { type: string }) => type === 'item_response').length > 1;

            if (!value && !isMoreThanOneItemResponse) {
              return false;
            }

            return true;
          },
        )
        .test(
          'validate required only one field',
          t('fieldMakeSelectionOrRemove'),
          function (value, textContext) {
            const parentPhrasalTemplateResponseValuePhraseSchema = textContext.from?.[1];
            const fields = parentPhrasalTemplateResponseValuePhraseSchema?.value?.fields || {
              type: '',
            };

            const isMoreThanOneItemResponse =
              fields?.filter(({ type }: { type: string }) => type === 'item_response').length > 1;

            if (!value && isMoreThanOneItemResponse) {
              return false;
            }

            return true;
          },
        ),
  }),
});

export const PhrasalTemplateResponseValuePhraseSchema = yup.object({
  image: yup.string().nullable(),
  fields: yup
    .array()
    .of(PhrasalTemplateResponseValuePhraseFieldSchema)
    .min(2, t('validationMessages.phraseTemplateMinFields'))
    .test(
      'minSentenceFields',
      t('validationMessages.phraseTemplateMinSentenceFields'),
      (fields = []) => fields.filter(({ type }) => type === 'sentence').length > 0,
    )
    .test(
      'minResponseFields',
      t('validationMessages.phraseTemplateMinResponseFields'),
      (fields = []) => fields.filter(({ type }) => type === 'item_response').length > 0,
    ),
});

export const PhrasalTemplateResponseValue = {
  cardTitle: yup
    .string()
    .trim()
    .required(t('fieldRequired'))
    .max(75, t('validationMessages.maxCharacters', { count: 75 })),
  phrases: yup.array().of(PhrasalTemplateResponseValuePhraseSchema).min(1),
};

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
          ItemTestFunctions.ExistingNameInSystemItem,
          ({ value: itemName }) => t('validationMessages.nameExistsInSystemItems', { itemName }),
          (_, context) =>
            testFunctionForSystemItems(context.parent, get(context, 'from.1.value.items') ?? []),
        )
        .test(
          ItemTestFunctions.UniqueItemName,
          t('validationMessages.unique', { field: t('itemName') }) as string,
          (itemName, context) =>
            testFunctionForUniqueness(itemName ?? '', get(context, 'from.1.value.items') ?? []),
        ),
      responseType: yup.string().required(getIsRequiredValidateMessage('itemType')),
      question: yup
        .string()
        .required(getIsRequiredValidateMessage('displayedContent'))
        .test(
          ItemTestFunctions.VariableInTheSameItem,
          t('validationMessages.variableInTheSameItem') as string,
          (itemName, context) =>
            testFunctionForTheSameVariable('question', itemName ?? '', context),
        )
        .test(
          ItemTestFunctions.VariableIsNotSupported,
          t('validationMessages.variableIsNotSupported') as string,
          (itemName, context) => testFunctionForNotSupportedItems(itemName ?? '', context),
        )
        .test(
          ItemTestFunctions.VariableReferringToSkippedItem,
          t('validationMessages.variableReferringToSkippedItem') as string,
          (itemName, context) => testFunctionForSkippedItems(itemName ?? '', context),
        )
        .test(
          ItemTestFunctions.VariableReferringToNotExistedItem,
          t('validationMessages.variableReferringToNotExistedItem') as string,
          (itemName, context) => testFunctionForNotExistedItems(itemName ?? '', context),
        ),
      responseValues: yup
        .object({})
        .when(['responseType', 'config'], ([responseType, config], schema) => {
          if (
            responseType === ItemResponseType.SingleSelection ||
            responseType === ItemResponseType.MultipleSelection
          ) {
            if (config.addScores) {
              return schema.shape({ options: ResponseValuesOptionsWithScoreSchema() });
            } else {
              return schema.shape({ options: ResponseValuesOptionsSchema() });
            }
          }

          if (responseType === ItemResponseType.NumberSelection)
            return schema.shape(ResponseValuesNumberSelectionSchema());

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

          if (responseType === ItemResponseType.Slider)
            return schema.shape(ResponseValuesSliderSchema());

          if (responseType === ItemResponseType.SliderRows)
            return schema.shape({ rows: ResponseValuesSliderRowsSchema() });

          if (responseType === ItemResponseType.PhrasalTemplate) {
            return schema.shape(PhrasalTemplateResponseValue);
          }

          if (responseType === ItemResponseType.RequestHealthRecordData) {
            return schema.shape(ResponseValuesRequestHealthRecordDataSchema());
          }

          return schema.nullable();
        }),
      alerts: yup
        .array()
        .when('responseType', ([responseType], schema) => {
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
                value: getSliderAlertValueValidation(false),
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
                value: yup.string().required(t('fillInAllRequired')),
                sliderId: yup.string().required(t('fillInAllRequired')),
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
                minValue: getSliderAlertValueValidation(true),
                maxValue: getSliderAlertValueValidation(true),
                alert: yup.string().required(getIsRequiredValidateMessage('alertMessage')),
              }),
            ),
          otherwise: (schema) => schema,
        }),
      config: yup
        .object({
          correctAnswerRequired: yup.boolean().nullable(),
          correctAnswer: yup
            .string()
            .nullable()
            .when('correctAnswerRequired', ([correctAnswerRequired], schema) =>
              correctAnswerRequired
                ? schema.required(getIsRequiredValidateMessage('correctAnswer'))
                : schema,
            ),
        })
        .when('responseType', {
          is: (responseType: ItemResponseType) =>
            responseType === ItemResponseType.Text ||
            responseType === ItemResponseType.ParagraphText,
          then: (schema) =>
            schema.shape({
              maxResponseLength: yup
                .mixed()
                .test('is-positive-integer', t('positiveIntegerRequired'), isNumberAtLeastOne),
            }),
          otherwise: (schema) => schema,
        }),
    })
    .required();

export const FlankerSchema = () =>
  yup
    .object({
      question: yup.string().when('order', ([order], schema) => {
        switch (order) {
          case 1:
            return schema.required(getIsRequiredValidateMessage('overviewInstruction'));
          case 2:
            return schema.required(getIsRequiredValidateMessage('practiceInstruction'));
          case 8:
            return schema.required(getIsRequiredValidateMessage('testInstruction'));
          default:
            return schema;
        }
      }),
      config: yup.object({}).when('order', ([order], schema) => {
        switch (order) {
          case 3:
            return getFlankerGeneralSchema(schema, RoundTypeEnum.Practice);
          case 9:
            return getFlankerGeneralSchema(schema, RoundTypeEnum.Test);
          default:
            return schema;
        }
      }),
    })
    .required();

export const GyroscopeAndTouchSchema = () =>
  yup
    .object({
      question: yup.string().when('order', ([order], schema) => {
        switch (order) {
          case 1:
            return schema.required(getIsRequiredValidateMessage('overviewInstruction'));
          case 2:
            return schema.required(getIsRequiredValidateMessage('practiceInstruction'));
          case 4:
            return schema.required(getIsRequiredValidateMessage('testInstruction'));
          default:
            return schema;
        }
      }),
      config: yup.object({}).when('order', ([order], schema) => {
        if (order === 3 || order === 5) {
          return schema.shape(GyroscopeAndTouchConfigSchema());
        }

        return schema;
      }),
    })
    .required();

const scoreSchema = yup
  .string()
  .required()
  .test('subscale-score-validator', getTestFunctionForSubscaleScore(checkScoreRegexp));
const optionalTextSchema = yup.string().nullable();
const SubscaleTableDataItemSchema = (featureFlags: FeatureFlags) =>
  yup
    .object({
      score: scoreSchema,
      rawScore: scoreSchema,
      age: featureFlags.enableCahmiSubscaleScoring
        ? yup.string().nullable().matches(ageRangeRegexp)
        : yup
            .string()
            .nullable()
            .test('subscale-age-validator', (age) => testFunctionForSubscaleAge('age', age)),
      sex: yup
        .string()
        .nullable()
        .matches(/^[MF]?$/),
      optionalText: optionalTextSchema,
      ...(featureFlags.enableCahmiSubscaleScoring
        ? {
            severity: yup
              .string()
              .nullable()
              // This includes the empty string so that there can be rows without a severity value
              .matches(createRegexFromList([...TScoreSeverity, ''])),
          }
        : {}),
    })
    .noUnknown()
    .required();

const TotalScoreTableDataItemSchema = () =>
  yup
    .object({
      rawScore: scoreSchema,
      optionalText: optionalTextSchema,
    })
    .noUnknown();

export const SubscaleTableDataSchema = (featureFlags: FeatureFlags) =>
  yup.array().of(SubscaleTableDataItemSchema(featureFlags)).nullable();

export const SubscaleSchema = (featureFlags: FeatureFlags) =>
  yup
    .object({
      name: yup
        .string()
        .required(getIsRequiredValidateMessage('subscaleName'))
        .test(
          'unique-subscale-name',
          t('validationMessages.unique', { field: t('subscaleName') }) as string,
          (subscaleName, context) =>
            testFunctionForUniqueness(
              subscaleName ?? '',
              get(context, 'from.1.value.subscales') ?? [],
            ),
        ),
      items: yup.array().min(1, t('validationMessages.atLeastOne') as string),
      scoring: yup.string(),
      subscaleTableData: SubscaleTableDataSchema(featureFlags),
    })
    .required();

const conditionValueSchema = yup.string().required(getIsRequiredValidateMessage('conditionValue'));
const conditionDateValueSchema = yup
  .date()
  .required(getIsRequiredValidateMessage('conditionValue'));
export const ItemFlowConditionSchema = () =>
  yup.object({
    itemName: yup.string().required(getIsRequiredValidateMessage('conditionItem')),
    type: yup.string().required(getIsRequiredValidateMessage('conditionType')),
    payload: yup.object({}).when('type', ([type], schema, options) => {
      const itemId = get(options, 'from.0.value.itemName');
      const items: ItemFormValues[] = get(options, 'from.2.value.items', []);
      const foundItem = items.find((item) => getEntityKey(item) === itemId);
      const isTime = foundItem?.responseType === ItemResponseType.Time;
      const isDate = foundItem?.responseType === ItemResponseType.Date;
      const isTimeRange = foundItem?.responseType === ItemResponseType.TimeRange;
      const isSingleSelectionPerRow =
        foundItem?.responseType === ItemResponseType.SingleSelectionPerRow;
      const isMultipleSelectionPerRow =
        foundItem?.responseType === ItemResponseType.MultipleSelectionPerRow;
      const isSliderRows = foundItem?.responseType === ItemResponseType.SliderRows;
      const typeShapeObject = { fieldName: conditionValueSchema };
      const rowIndexShapeObject = { rowIndex: conditionValueSchema };

      if (!type) {
        if (isTimeRange) {
          return schema.shape(typeShapeObject);
        }
        if (isSingleSelectionPerRow || isMultipleSelectionPerRow || isSliderRows) {
          return schema.shape(rowIndexShapeObject);
        }
      }
      if (!type || CONDITION_TYPES_TO_HAVE_OPTION_ID.includes(type)) {
        const baseSchema = schema.shape({
          optionValue: conditionValueSchema,
        });
        if (isSingleSelectionPerRow || isMultipleSelectionPerRow) {
          return baseSchema.concat(yup.object(rowIndexShapeObject));
        }

        return baseSchema;
      }
      if (CONDITION_TYPES_TO_HAVE_SINGLE_VALUE.includes(type)) {
        if (isDate) {
          return schema.shape({
            date: conditionDateValueSchema,
          });
        }
        if (isTime || isTimeRange) {
          const timeSchema = schema.shape({ time: conditionValueSchema });

          return isTimeRange ? timeSchema.concat(yup.object(typeShapeObject)) : timeSchema;
        }
        const baseSchema = schema.shape({
          value: conditionValueSchema,
        });
        if (isSliderRows) {
          return baseSchema.concat(yup.object(rowIndexShapeObject));
        }

        return baseSchema;
      }
      if (CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(type)) {
        if (isTime || isTimeRange) {
          const timeSchema = schema.shape({
            minTime: conditionValueSchema,
            maxTime: conditionValueSchema,
          });

          return isTimeRange ? timeSchema.concat(yup.object(typeShapeObject)) : timeSchema;
        }

        if (isDate) {
          return schema.shape({
            minDate: conditionDateValueSchema,
            maxDate: conditionDateValueSchema,
          });
        }

        const valueSchema = schema.shape({
          minValue: conditionValueSchema,
          maxValue: conditionValueSchema,
        });

        return isSliderRows ? valueSchema.concat(yup.object(rowIndexShapeObject)) : valueSchema;
      }

      return schema;
    }),
  });

export const ConditionSchema = () =>
  yup.object({
    itemName: yup.string().required(getIsRequiredValidateMessage('conditionItem')),
    type: yup.string().required(getIsRequiredValidateMessage('conditionType')),
    payload: yup.object({}).when('type', ([type], schema) => {
      if (!type || CONDITION_TYPES_TO_HAVE_OPTION_ID.includes(type))
        return schema.shape({
          optionValue: conditionValueSchema,
        });
      if (CONDITION_TYPES_TO_HAVE_SINGLE_VALUE.includes(type)) {
        return schema.shape({
          value: conditionValueSchema,
        });
      }
      if (CONDITION_TYPES_TO_HAVE_RANGE_VALUE.includes(type)) {
        return schema.shape({
          minValue: conditionValueSchema,
          maxValue: conditionValueSchema,
        });
      }

      return schema;
    }),
  });

export const ConditionalLogicSchema = (featureFlags: FeatureFlags) =>
  yup.object({
    match: yup.string().required(getIsRequiredValidateMessage('conditionMatch')),
    itemKey: yup
      .string()
      .required(t('fillInAllRequired') as string)
      .test('item-flow-contradiction', function (itemKey) {
        const { createError, path, parent, from } = this;
        const items = (get(from, '1.value.items') ?? []) as ItemFormValues[];
        const conditions = get(parent, 'conditions') as Condition[];
        const itemsObject = getObjectFromList(items, undefined, true);

        const conditionItemsInUsageSet = new Set(conditions.map((condition) => condition.itemName));
        const itemIndex = itemsObject[itemKey]?.index ?? -1;

        // 1# rule: summaryItemIsTheSameAsRuleItem
        if (conditionItemsInUsageSet.has(itemKey)) {
          return createError({ path, message: t('summaryItemSameAsRuleItem') });
        }

        // 2# rule: summaryItemIsBeforeRuleItemInTheList
        const maxUsedItemIndex = Math.max(
          ...[...conditionItemsInUsageSet].map((key) => itemsObject[key]?.index ?? -1),
        );
        if (itemIndex <= maxUsedItemIndex) {
          return createError({ path, message: t('appletHasItemFlowContradictions') });
        }

        return true;
      }),
    conditions: yup
      .array()
      .of(featureFlags.enableItemFlowExtendedItems ? ItemFlowConditionSchema() : ConditionSchema()),
  });

const getReportCommonFields = (isScoreReport = false) => ({
  showMessage: yup.boolean(),
  printItems: yup.boolean().when('showMessage', {
    is: false,
    then: (schema) =>
      schema.test(
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
      then: (schema) => schema.required(getIsRequiredValidateMessage('message')),
    })
    .nullable(),
  itemsPrint: yup.array().when('printItems', {
    is: true,
    then: (schema) => schema.min(1, <string>t('validationMessages.atLeastOneItem')).nullable(),
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
          testFunctionForUniqueness(
            scoreConditionName ?? '',
            get(context, 'from.1.value.conditionalLogic') ?? [],
          ),
      ),
    conditions: yup
      .array()
      .of(ConditionSchema())
      .min(1, <string>t('validationMessages.atLeastOneCondition')),
    flagScore: yup.boolean(),
    ...getReportCommonFields(),
    match: getConditionsMatch(t('validationMessages.conditionalRule')),
  });

export const ScoreSchema = () => ({
  name: yup
    .string()
    .required(getIsRequiredValidateMessage('scoreName'))
    .test(
      'unique-score-name',
      t('validationMessages.unique', { field: t('scoreName') }) as string,
      (scoreName, context) => {
        const reports = (get(context, 'from.1.value.reports') ?? []) as ScoreOrSection[];
        const scores = reports?.filter(({ type }) => type === ScoreReportType.Score);

        return testFunctionForUniqueness(scoreName ?? '', scores);
      },
    ),
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
    match: getConditionsMatch(t('validationMessages.conditionalRule')),
  });

export const TotalScoresTableDataSchema = yup
  .array()
  .of(TotalScoreTableDataItemSchema())
  .nullable();

export const SectionSchema = () => ({
  name: yup
    .string()
    .required(getIsRequiredValidateMessage('sectionName'))
    .matches(alphanumericAndHyphenRegexp, {
      message: t('validationMessages.alphanumericAndHyphen', { field: t('sectionName') }),
    })
    .test(
      'unique-section-name',
      t('validationMessages.unique', { field: t('sectionName') }) as string,
      (sectionName, context) => {
        const reports = (get(context, 'from.1.value.reports') ?? []) as ScoreOrSection[];
        const sections = reports?.filter(({ type }) => type === ScoreReportType.Section);

        return testFunctionForUniqueness(sectionName ?? '', sections);
      },
    ),
  conditionalLogic: SectionConditionalLogic().nullable(),
});

export const ScoreOrSectionSchema = () =>
  yup.object({
    type: yup.string(),
    name: yup.string().when('type', {
      is: ScoreReportType.Section,
      then: () => SectionSchema().name,
      otherwise: () => ScoreSchema().name,
    }),
    conditionalLogic: yup.mixed().when('type', {
      is: ScoreReportType.Section,
      then: () => SectionSchema().conditionalLogic,
      otherwise: () => ScoreSchema().conditionalLogic,
    }),
    calculationType: yup.string().when('type', {
      is: ScoreReportType.Score,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    }),
    // Technically this field is required, but it may be null in existing data
    // so we enforce this instead in the UI
    scoringType: yup.string().oneOf(ScoreReportScoringType).nullable(),
    subscaleName: yup.string().when('scoringType', {
      is: 'score',
      then: (schema) => schema.required(t('subscaleNameRequired')),
      otherwise: (schema) => schema.nullable(),
    }),
    id: yup.string().when('type', {
      is: ScoreReportType.Score,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    }),
    itemsScore: yup.array().when('type', {
      is: ScoreReportType.Score,
      then: (schema) => schema.min(1, <string>t('validationMessages.atLeastOneItem')),
      otherwise: (schema) => schema.nullable(),
    }),
    showMessage: yup.boolean(),
    printItems: yup.boolean().when('showMessage', ([showMessage], schema) => {
      if (!showMessage)
        return schema.when('type', ([type]: ScoreReportType[], schema: yup.BooleanSchema) =>
          schema.test(
            'required-report-common-fields',
            <string>t('validationMessages.mustShowMessageOrItems'),
            (printItemsName: boolean | undefined, context: yup.TestContext) =>
              testIsReportCommonFieldsRequired(
                type === ScoreReportType.Score,
                !!printItemsName,
                context,
              ),
          ),
        );

      return schema;
    }),
    message: yup
      .string()
      .when('showMessage', {
        is: true,
        then: (schema) => schema.required(getIsRequiredValidateMessage('message')),
      })
      .nullable(),
    itemsPrint: yup.array().when('printItems', {
      is: true,
      then: (schema) => schema.min(1, <string>t('validationMessages.atLeastOneItem')).nullable(),
    }),
  });

export const ActivitySchema = (featureFlags: FeatureFlags) =>
  yup.object({
    name: yup
      .string()
      .required(getIsRequiredValidateMessage('activityName'))
      .test(
        'unique-activity-name',
        t('validationMessages.unique', { field: t('activityName') }) as string,
        (activityName, context) =>
          testFunctionForUniqueness(
            activityName ?? '',
            get(context, 'from.1.value.activities') ?? [],
          ),
      ),
    description: yup.string(),
    image: yup.string(),
    splashScreen: yup.string(),
    isSkippable: yup.boolean(),
    isReviewable: yup.boolean(),
    responseIsEditable: yup.boolean(),
    items: yup
      .array()
      .when('performanceTaskType', ([performanceTaskType], schema) => {
        switch (performanceTaskType) {
          case PerfTaskType.Flanker:
            return schema.of(FlankerSchema());
          case PerfTaskType.Gyroscope:
          case PerfTaskType.Touch:
            return schema.of(GyroscopeAndTouchSchema());
          case PerfTaskType.ABTrailsMobile:
          case PerfTaskType.ABTrailsTablet:
          case 'ABTrails':
            return schema;
          default:
            return schema.of(ItemSchema());
        }
      })
      .min(1),
    isHidden: yup.boolean(),
    subscaleSetting: yup
      .object({
        calculateTotalScore: yup.string().nullable(),
        subscales: yup.array().of(SubscaleSchema(featureFlags)),
        totalScoresTableData: yup.array().of(TotalScoreTableDataItemSchema()).nullable(),
      })
      .nullable(),
    conditionalLogic: yup.array().of(ConditionalLogicSchema(featureFlags)),
    scoresAndReports: yup
      .object({
        generateReport: yup.boolean(),
        showScoreSummary: yup.boolean(),
        reports: yup.array().of(ScoreOrSectionSchema()),
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
            testFunctionForUniqueness(
              activityFlowName ?? '',
              get(context, 'from.1.value.activityFlows') ?? [],
            ),
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

export const AppletSchema = (featureFlags: FeatureFlags) =>
  yup.object({
    displayName: yup.string().required(getIsRequiredValidateMessage('appletName')),
    description: yup.string(),
    themeId: yup.string().nullable(),
    about: yup.string(),
    image: yup.string(),
    watermark: yup.string(),
    activities: yup.array().of(ActivitySchema(featureFlags)).min(1),
    activityFlows: yup.array().of(ActivityFlowSchema()),
    streamIpAddress: yup.string().matches(IP_ADDRESS_REGEXP, t('invalidIpAddress')).nullable(),
    streamPort: yup.string().matches(PORT_REGEXP, t('invalidPort')).nullable(),
  });
