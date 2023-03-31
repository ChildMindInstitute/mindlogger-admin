import * as yup from 'yup';

import i18n from 'i18n';
import { RetentionPeriods } from 'shared/types';

export const dataRetentionSchema = () => {
  const { t } = i18n;

  return yup
    .object({
      period: yup.string().required(),
      periodNumber: yup
        .number()
        .transform((value) => (!value || isNaN(value) ? 1 : value))
        .when('period', (period, schema) =>
          period === RetentionPeriods.Indefinitely ? schema : schema.required(t('periodRequired')),
        ),
    })
    .required();
};
