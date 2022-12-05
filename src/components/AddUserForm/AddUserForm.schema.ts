import * as yup from 'yup';
import i18n from 'i18n';

export const AddUserSchema = () => {
  const { t } = i18n;
  const emailRequired = t('emailRequired');
  const incorrectEmail = t('incorrectEmail');
  const firstNameRequired = t('firstNameRequired');
  const lastNameRequired = t('lastNameRequired');
  const secretUserIdRequired = t('secretUserIdRequired');
  const accountNameRequired = t('accountNameRequired');

  return yup
    .object({
      email: yup.string().required(emailRequired).email(incorrectEmail),
      firstName: yup.string().required(firstNameRequired),
      lastName: yup.string().required(lastNameRequired),
      MRN: yup
        .string()
        .when('role', (role, schema) =>
          role === 'user' ? schema.required(secretUserIdRequired) : schema,
        ),
      accountName: yup
        .string()
        .when('role', (role, schema) =>
          role !== 'user' ? schema.required(accountNameRequired) : schema,
        ),
    })
    .required();
};
