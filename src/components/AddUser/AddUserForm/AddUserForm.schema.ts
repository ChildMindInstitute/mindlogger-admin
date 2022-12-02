import * as yup from 'yup';
import i18n from 'i18n';

export const AddUserSchema = () => {
  const { t } = i18n;
  const emailRequired = t('emailRequired');
  const incorrectEmail = t('incorrectEmail');
  const firstNameRequired = t('firstNameRequired');
  const lastNameRequired = t('lastNameRequired');
  const secretUserIdRequired = t('secretUserIdRequired');

  return yup
    .object({
      email: yup.string().required(emailRequired).email(incorrectEmail),
      firstName: yup.string().required(firstNameRequired),
      lastName: yup.string().required(lastNameRequired),
      secretUserId: yup.string().required(secretUserIdRequired),
    })
    .required();
};
