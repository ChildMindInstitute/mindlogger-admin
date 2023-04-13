import * as yup from 'yup';

import i18n from 'i18n';
import { getMaxLengthValidationError } from 'shared/utils';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from 'shared/consts';

const { t } = i18n;

export const getIsRequiredValidateMessage = (field: string) =>
  t('validationMessages.isRequired', { field: t(field) });

export const ItemSchema = () =>
  yup
    .object({
      name: yup
        .string()
        .required(getIsRequiredValidateMessage('itemName'))
        .matches(/^[\w]+$/g, {
          message: t('validationMessages.alphanumeric', { field: 'itemName' }),
        }),
      responseType: yup.string().required(getIsRequiredValidateMessage('itemType')),
      question: yup.string().required(getIsRequiredValidateMessage('displayedContent')),
      responseValues: yup.object({ options: yup.array().of(yup.object({})) }),
      config: yup.object({}),
    })
    .required();

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
    items: yup.array().of(ItemSchema()),
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
