import * as yup from 'yup';

import i18n from 'i18n';
import { getMaxLengthValidationError } from 'shared/utils';
import {
  ItemResponseType,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_SELECT_OPTION_TEXT_LENGTH,
  MAX_SLIDER_LABEL_TEXT_LENGTH,
} from 'shared/consts';

const { t } = i18n;

export const getIsRequiredValidateMessage = (field: string) =>
  t('validationMessages.isRequired', { field: t(field) });

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

export const ItemSchema = () => {
  const itemSchema = yup
    .object({
      name: yup
        .string()
        .required(getIsRequiredValidateMessage('itemName'))
        .matches(/^\w+$/g, {
          message: t('validationMessages.alphanumeric', { field: t('itemName') }),
        }),
      responseType: yup.string().required(getIsRequiredValidateMessage('itemType')),
      question: yup.string().required(getIsRequiredValidateMessage('displayedContent')),
      responseValues: yup.object({}).when('responseType', (responseType, schema) => {
        if (
          responseType === ItemResponseType.SingleSelection ||
          responseType === ItemResponseType.MultipleSelection
        )
          return schema.shape({ options: ResponseValuesOptionsSchema() });

        if (responseType === ItemResponseType.Slider)
          return schema.shape(ResponseValuesRowsSchema());

        return schema;
      }),
      config: yup.object({}),
    })
    .required();

  return itemSchema;
};

export const ActivitySchema = () =>
  yup.object({
    name: yup.string().required(getIsRequiredValidateMessage('activityName')),
    description: yup.string(),
    image: yup.string(),
    splashScreen: yup.string(),
    showAllAtOnce: yup.boolean(),
    isSkippable: yup.boolean(),
    isReviewable: yup.boolean(),
    responseIsEditable: yup.boolean(),
    items: yup.array().of(ItemSchema()).min(1),
    isHidden: yup.boolean(),
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
        .max(MAX_NAME_LENGTH, getMaxLengthValidationError),
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
