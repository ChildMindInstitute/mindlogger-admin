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
      key: yup.string().required(),
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
    name: yup.string().required(getIsRequiredValidateMessage('appletName')),
    description: yup.string(),
    colorTheme: yup.string(),
    aboutApplet: yup.string(),
    appletImage: yup.string(),
    appletWatermark: yup.string(),
    activities: yup.array().of(ActivitySchema()).required(),
  });
