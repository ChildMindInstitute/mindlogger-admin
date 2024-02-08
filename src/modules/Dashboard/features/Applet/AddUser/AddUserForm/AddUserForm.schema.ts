import * as yup from 'yup';

import i18n from 'i18n';
import { Roles } from 'shared/consts';
import { getEmailValidationSchema } from 'shared/utils';

export const AddUserSchema = (isWorkspaceName: boolean | undefined) => {
  const { t } = i18n;
  const firstNameRequired = t('firstNameRequired');
  const lastNameRequired = t('lastNameRequired');
  const secretUserIdRequired = t('secretUserIdRequired');
  const workspaceNameRequired = t('workspaceNameRequired');

  return yup
    .object({
      email: getEmailValidationSchema(),
      firstName: yup.string().required(firstNameRequired),
      lastName: yup.string().required(lastNameRequired),
      nickName: yup.string(),
      role: yup.string().required(),
      secretUserId: yup
        .string()
        .when('role', ([role], schema) => (role === Roles.Respondent ? schema.required(secretUserIdRequired) : schema)),
      workspacePrefix: yup
        .string()
        .when('role', ([role], schema) =>
          role !== Roles.Respondent && isWorkspaceName ? schema.required(workspaceNameRequired) : schema,
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
