import * as yup from 'yup';
import get from 'lodash/get';

import i18n from 'i18n';
import { getMaxLengthValidationError, getIsRequiredValidateMessage } from 'shared/utils';
import {
  ItemResponseType,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_SELECT_OPTION_TEXT_LENGTH,
  MAX_SLIDER_LABEL_TEXT_LENGTH,
} from 'shared/consts';
import { Config } from 'shared/state';
import {
  ItemConfigurationSettings,
  SLIDER_LABEL_MAX_LENGTH,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration';

import { testFunctionForUniqueness } from './BuilderApplet.utils';
import { CONDITION_TYPES_TO_HAVE_OPTION_ID } from './BuilderApplet.const';

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
    rowName: yup.string().required(getIsRequiredValidateMessage('row')),
  });

export const ResponseValuesSelectionOptionsSchema = () =>
  yup.object({
    text: yup.string().required(getIsRequiredValidateMessage('option')),
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

export const ItemSchema = () =>
  yup
    .object({
      name: yup
        .string()
        .required(getIsRequiredValidateMessage('itemName'))
        .matches(/^\w+$/g, {
          message: t('validationMessages.alphanumeric', { field: t('itemName') }),
        })
        .test(
          'unique-item-name',
          t('validationMessages.unique', { field: t('itemName') }) as string,
          (itemName, context) => testFunctionForUniqueness('items', itemName ?? '', context),
        ),
      responseType: yup.string().required(getIsRequiredValidateMessage('itemType')),
      question: yup.string().required(getIsRequiredValidateMessage('displayedContent')),
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
      config: yup.object({}).shape({
        correctAnswerRequired: yup.boolean().nullable(),
        correctAnswer: yup
          .string()
          .nullable()
          .when('correctAnswerRequired', (correctAnswerRequired, schema) =>
            correctAnswerRequired
              ? schema.required(getIsRequiredValidateMessage('correctAnswer'))
              : schema,
          ),
      }),
    })
    .required();

const SubscaleTableDataItemSchema = () =>
  yup
    .object({
      score: yup.string(),
      rawScore: yup.string(),
      age: yup.number().nullable(),
      sex: yup.string().nullable(),
      optionalText: yup.string().nullable(),
    })
    .required();

const TotalScoreTableDataItemSchema = () =>
  yup.object({
    rawScore: yup.string(),
    optionalText: yup.string().nullable(),
  });

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
      subscaleTableData: yup.array().of(SubscaleTableDataItemSchema()),
    })
    .required();

export const ConditionSchema = () =>
  yup.object({
    itemName: yup.string().required(getIsRequiredValidateMessage('conditionItem')),
    type: yup.string().required(getIsRequiredValidateMessage('conditionType')),
    payload: yup.object({}).when('type', (type, schema) => {
      if (!type || CONDITION_TYPES_TO_HAVE_OPTION_ID.includes(type))
        return schema.shape({
          optionId: yup.string().required(getIsRequiredValidateMessage('conditionValue')),
        });

      return schema;
    }),
  });

export const ConditionalLogicSchema = () =>
  yup.object({
    match: yup.string().required(getIsRequiredValidateMessage('conditionMatch')),
    itemKey: yup.string().required(getIsRequiredValidateMessage('conditionTarget')),
    conditions: yup.array().of(ConditionSchema()),
  });

export const ScoreSchema = () =>
  yup
    .object({
      name: yup
        .string()
        .required(getIsRequiredValidateMessage('scoreName'))
        .test(
          'unique-score-name',
          t('validationMessages.unique', { field: t('scoreName') }) as string,
          (scoreName, context) => testFunctionForUniqueness('scores', scoreName ?? '', context),
        ),
      showMessage: yup.boolean().required(),
      minScore: yup.number(),
      maxScore: yup.number(),
      calculationType: yup.string().required(),
      printItems: yup.boolean().required(),
      message: yup.string().when('showMessage', {
        is: true,
        then: yup.string().required(getIsRequiredValidateMessage('message')),
      }),
      itemsScore: yup.array().min(1, <string>t('validationMessages.atLeastOneItem')),
      itemsPrint: yup.array().when('printItems', {
        is: true,
        then: yup.array().min(1, <string>t('validationMessages.atLeastOneItem')),
      }),
    })
    .required();

export const SectionSchema = () =>
  yup
    .object({
      name: yup
        .string()
        .required(getIsRequiredValidateMessage('sectionName'))
        .test(
          'unique-section-name',
          t('validationMessages.unique', { field: t('sectionName') }) as string,
          (sectionName, context) =>
            testFunctionForUniqueness('sections', sectionName ?? '', context),
        ),
      showMessage: yup.boolean().required(),
      printItems: yup
        .boolean()
        .required()
        .when('showMessage', {
          is: false,
          then: yup.boolean().oneOf([true], <string>t('validationMessages.mustShowMessageOrItems')),
        }),
      message: yup.string().when('showMessage', {
        is: true,
        then: yup.string().required(getIsRequiredValidateMessage('message')),
      }),
      itemsPrint: yup.array().when('printItems', {
        is: true,
        then: yup.array().min(1, <string>t('validationMessages.atLeastOneItem')),
      }),
    })
    .required();

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
