import * as yup from 'yup';

import i18n from 'i18n';

const dateSchema = (periodRequired: string) =>
  yup.date().when('dateType', ([dateType], schema) => {
    if (dateType === 'chooseDates') {
      return schema.required(periodRequired);
    }

    return schema;
  });

const { t } = i18n;
export const exportDataSettingSchema = () => {
  const fieldRequired = t('fieldRequired');
  const periodRequired = t('periodRequired');

  return yup
    .object({
      dateType: yup.string().required(fieldRequired),
      fromDate: dateSchema(periodRequired),
      toDate: dateSchema(periodRequired),
    })
    .required();
};
