import * as yup from 'yup';

import i18n from 'i18n';
import { EMAIL_REGEXP, Roles } from 'shared/consts';
import { Languages } from 'api';

export const AddManagerPopupSchema = (isWorkspaceNameVisible: boolean) => {
  const { t } = i18n;

  return yup
    .object({
      role: yup.string().required().oneOf(Object.values(Roles)),
      email: yup
        .string()
        .required(t('emailRequired'))
        .test('isValidEmail', t('incorrectEmail'), (value) => EMAIL_REGEXP.test(value)),
      firstName: yup.string().required(t('firstNameRequired')),
      lastName: yup.string().required(t('lastNameRequired')),
      title: yup.string(),
      language: yup.string().required().oneOf(Object.values(Languages)),
      subjectIds: yup.array().of(yup.string().required()),
      workspaceName: isWorkspaceNameVisible
        ? yup.string().required(t('workspaceNameRequired'))
        : yup.string(),
    })
    .required();
};
