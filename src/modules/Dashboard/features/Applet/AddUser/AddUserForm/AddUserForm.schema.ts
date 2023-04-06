import * as yup from 'yup';

import i18n from 'i18n';
import { Roles } from 'shared/consts';

export const AddUserSchema = (isWorkspaceName: boolean | undefined) => {
  const { t } = i18n;
  const emailRequired = t('emailRequired');
  const incorrectEmail = t('incorrectEmail');
  const firstNameRequired = t('firstNameRequired');
  const lastNameRequired = t('lastNameRequired');
  const secretUserIdRequired = t('secretUserIdRequired');
  const workspaceNameRequired = t('workspaceNameRequired');

  return yup
    .object({
      email: yup.string().required(emailRequired).email(incorrectEmail),
      firstName: yup.string().required(firstNameRequired),
      lastName: yup.string().required(lastNameRequired),
      secretUserId: yup
        .string()
        .when('role', (role, schema) =>
          role === Roles.Respondent ? schema.required(secretUserIdRequired) : schema,
        ),
      workspacePrefix: yup
        .string()
        .when('role', (role, schema) =>
          role !== Roles.Respondent && isWorkspaceName
            ? schema.required(workspaceNameRequired)
            : schema,
        ),
    })
    .required();
};
