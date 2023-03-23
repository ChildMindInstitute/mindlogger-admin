import * as yup from 'yup';

import i18n from 'i18n';

export const itemConfigurationFormSchema = () => {
  const { t } = i18n;
  const itemNameRequired = t('itemNameRequired');
  const itemNameSymbols = t('itemNameSymbols');
  const minValueLessThanMax = t('minValueLessThanMax');
  const minValuePositiveInt = t('minValuePositiveInt');
  const maxValueBiggerThanMin = t('maxValueBiggerThanMin');
  const maxValuePositiveInt = t('maxValuePositiveInt');

  return yup
    .object({
      name: yup
        .string()
        .required(itemNameRequired)
        .matches(/^[a-zA-Z0-9_]+$/, itemNameSymbols),
      minNumber: yup
        .number()
        .typeError(minValuePositiveInt)
        .lessThan(yup.ref('maxNumber'), minValueLessThanMax),
      maxNumber: yup
        .number()
        .typeError(maxValuePositiveInt)
        .moreThan(yup.ref('minNumber'), maxValueBiggerThanMin),
    })
    .required();
};
