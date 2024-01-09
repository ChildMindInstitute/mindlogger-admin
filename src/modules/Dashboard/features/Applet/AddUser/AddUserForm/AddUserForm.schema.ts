import * as yup from 'yup';

import i18n from 'i18n';
import { EMAIL_REGEXP, Roles } from 'shared/consts';

import { SubmitBtnType } from './AddUserForm.const';

export const AddUserSchema = (isWorkspaceName: boolean | undefined) => {
  const { t } = i18n;
  const firstNameRequired = t('firstNameRequired');
  const lastNameRequired = t('lastNameRequired');
  const secretUserIdRequired = t('secretUserIdRequired');
  const workspaceNameRequired = t('workspaceNameRequired');

  return yup
    .object({
      submitBtnType: yup.string().oneOf(Object.values(SubmitBtnType)).required(),
      email: yup
        .string()
        .test('isWithInvitation', t('emailRequired'), function (value) {
          const submitBtnType = this.parent?.submitBtnType;
          if (submitBtnType === SubmitBtnType.WithInvitation) {
            return value !== undefined && value !== '';
          }

          return true;
        })
        .test('isCorrectEmail', t('incorrectEmail'), function (value) {
          const submitBtnType = this.parent?.submitBtnType;
          if (
            value !== undefined &&
            (submitBtnType === SubmitBtnType.WithInvitation || value !== '')
          ) {
            return EMAIL_REGEXP.test(value);
          }

          return true;
        }),
      firstName: yup.string().required(firstNameRequired),
      lastName: yup.string().required(lastNameRequired),
      nickName: yup.string(),
      role: yup.string().required(),
      secretUserId: yup
        .string()
        .when('role', ([role], schema) =>
          role === Roles.Respondent ? schema.required(secretUserIdRequired) : schema,
        ),
      workspacePrefix: yup
        .string()
        .when('role', ([role], schema) =>
          role !== Roles.Respondent && isWorkspaceName
            ? schema.required(workspaceNameRequired)
            : schema,
        ),
      language: yup.string(),
      respondents: yup.array().of(
        yup.object({
          label: yup.string().required(),
          id: yup.string().required(),
        }),
      ),
    })
    .required();
};
