import * as yup from 'yup';

import i18n from 'i18n';

const { t } = i18n;

export const getIsRequiredValidateMessage = (field: string) =>
  t('validationMessages.isRequired', { field: t(field) });

export const ItemSchema = () =>
  yup
    .object({
      name: yup.string().required(getIsRequiredValidateMessage('itemName')),
      responseType: yup.string().required(getIsRequiredValidateMessage('itemType')),
    })
    .required();

export const ActivitySchema = () =>
  yup
    .object({
      name: yup.string().required(getIsRequiredValidateMessage('activityName')),
      description: yup.string(),
      image: yup.string(),
      splashScreen: yup.string(),
      showAllAtOnce: yup.boolean(),
      isSkippable: yup.boolean(),
      isReviewable: yup.boolean(),
      responseIsEditable: yup.boolean(),
      items: yup.array().of(ItemSchema()).required(),
      isHidden: yup.boolean(),
    })
    .required();

export const AppletSchema = () =>
  yup.object({
    displayName: yup.string().required(getIsRequiredValidateMessage('appletName')),
    description: yup.string(),
    themeId: yup.string(),
    about: yup.string(),
    image: yup.string(),
    watermark: yup.string(),
    activities: yup.array().of(ActivitySchema()).required(),
  });
