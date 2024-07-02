import * as yup from 'yup';

import i18n from 'i18n';
import { PARTICIPANT_TAGS } from 'shared/consts';

export const editRespondentFormSchema = () => {
  const { t } = i18n;
  const requiredField = t('requiredField');

  return yup
    .object({
      secretUserId: yup.string().required(requiredField),
      nickname: yup.string(),
      tag: yup.string().oneOf(PARTICIPANT_TAGS),
    })
    .required();
};
