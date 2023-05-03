import * as yup from 'yup';

import i18n from 'i18n';
import { getMaxLengthValidationError, getIsRequiredValidateMessage } from 'shared/utils';
import {
  ItemResponseType,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_SELECT_OPTION_TEXT_LENGTH,
  MAX_SLIDER_LABEL_TEXT_LENGTH,
} from 'shared/consts';
import { SLIDER_LABEL_MAX_LENGTH } from 'modules/Builder/features/ActivityItems/ItemConfiguration';

import { testFunctionForUniqueness } from './BuilderApplet.utils';

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

export const ResponseValuesRowsSchema = () => ({
  minLabel: yup.string().max(MAX_SLIDER_LABEL_TEXT_LENGTH, getMaxLengthValidationError),
  maxLabel: yup.string().max(MAX_SLIDER_LABEL_TEXT_LENGTH, getMaxLengthValidationError),
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
  file: yup.string(),
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
          return schema.shape(ResponseValuesRowsSchema());

        if (responseType === ItemResponseType.AudioPlayer)
          return schema.shape(ResponseValuesAudioPlayer());

        if (responseType === ItemResponseType.Audio) return schema.shape(ResponseValuesAudio());

        if (responseType === ItemResponseType.SliderRows)
          return schema.shape({ rows: ResponseValuesSliderRowsSchema() });

        return schema.nullable();
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
    subscales: yup.array().of(SubscaleSchema()),
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
