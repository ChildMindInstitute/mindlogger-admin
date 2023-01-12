import i18n from 'i18n';
import * as yup from 'yup';

export const reportConfigSchema = () => {
  const { t } = i18n;
  const emailRequired = t('enterRespondentEmail');

  return yup
    .object({
      email: yup.string().required(emailRequired),
      respondentId: yup.string(),
      caseId: yup.string(),
      subject: yup.string().required(),
      description: yup.string(),
      serverURL: yup.string(),
      appletDescription: yup.string(),
    })
    .required();
};
