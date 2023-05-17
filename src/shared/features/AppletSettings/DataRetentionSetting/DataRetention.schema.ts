import * as yup from 'yup';

import i18n from 'i18n';
import { RetentionPeriods } from 'shared/types';

export const dataRetentionSchema = () => {
  const { t } = i18n;

  return yup
    .object({
      retention: yup.string().required(),
      period: yup
        .number()
        .transform((value) => (!value || isNaN(value) ? 1 : value))
        .when('retention', (retention, schema) =>
          retention === RetentionPeriods.Indefinitely
            ? schema
            : schema.required(t('periodRequired')),
        ),
    })
    .required();
};
