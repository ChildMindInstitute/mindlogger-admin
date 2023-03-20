import i18n from 'i18n';
import * as yup from 'yup';

export const dataRetentionSchema = () => {
  const { t } = i18n;

  return yup
    .object({
      period: yup.string().required(),
      periodNumber: yup
        .number()
        .transform((value) => (!value || isNaN(value) ? 1 : value))
        .when('period', (period, schema) =>
          period === 'indefinitely' ? schema : schema.required(t('periodRequired')),
        ),
    })
    .required();
};
