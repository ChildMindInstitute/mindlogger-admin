import * as yup from 'yup';

import i18n from 'i18n';
import { RetentionPeriods } from 'shared/types';

export const dataRetentionSchema = () => {
  const { t } = i18n;

  return yup
    .object({
      retentionType: yup.mixed<RetentionPeriods>().oneOf(Object.values(RetentionPeriods)).required(),
      retentionPeriod: yup
        .number()
        .transform(value => (!value || isNaN(value) ? 1 : value))
        .when('retentionType', ([retentionType], schema) =>
          retentionType === RetentionPeriods.Indefinitely ? schema : schema.required(t('periodRequired')),
        ),
    })
    .required();
};
