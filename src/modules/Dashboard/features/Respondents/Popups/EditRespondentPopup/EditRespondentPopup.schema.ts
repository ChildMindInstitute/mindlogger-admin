import * as yup from 'yup';

import i18n from 'i18n';

export const editRespondentFormSchema = () => {
  const { t } = i18n;
  const requiredField = t('requiredField');

  return yup
    .object({
      secretUserId: yup.string().required(requiredField),
      nickname: yup.string(),
    })
    .required();
};
