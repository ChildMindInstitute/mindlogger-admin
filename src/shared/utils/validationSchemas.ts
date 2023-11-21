import * as yup from 'yup';

import i18n from 'i18n';
import { EMAIL_REGEXP } from 'shared/consts';

export const getEmailValidationSchema = () => {
  const { t } = i18n;

  return yup.string().required(t('emailRequired')).matches(EMAIL_REGEXP, t('incorrectEmail'));
};
