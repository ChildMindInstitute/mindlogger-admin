import i18n from 'i18n';
import * as yup from 'yup';

export const reportConfigSchema = () => {
  const { t } = i18n;
  const emailRequired = t('enterRecipientsEmails');
  const incorrectEmail = t('incorrectEmail');

  return yup
    .object({
      email: yup
        .string()
        .email(incorrectEmail)
        .test('check_emailRecipients', emailRequired, (value, testContext) =>
          testContext ? value || testContext.parent?.emailRecipients.length : true,
        ),
      respondentId: yup.string(),
      caseId: yup.string(),
      subject: yup.string().required(),
      description: yup.string(),
      serverURL: yup.string(),
      appletDescription: yup.string(),
    })
    .required();
};
