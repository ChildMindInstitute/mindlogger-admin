import i18n from 'i18n';
import * as yup from 'yup';

export const dataRetentionSchema = () => {
  const { t } = i18n;

  return yup
    .object({
      period: yup.string().required(),
      periodNumber: yup
        .string()
        .when('period', (period, schema) =>
          period === 'indefinitely' ? schema : schema.required(t('periodRequired')),
        ),
    })
    .required();
};
