import * as yup from 'yup';

import i18n from 'i18n';

export const uploadDataSchema = () => {
  const { t } = i18n;

  const visitsFormSchema = yup.object().shape({
    userId: yup.string().required(),
    secretUserId: yup.string().required(),
    activityId: yup.string().required(),
    activityName: yup.string().required(),
    answerId: yup.string().required(),
    version: yup.string().required(),
    completedDate: yup.string().required(),
    selected: yup.boolean(),
    visit: yup.string().when('selected', {
      is: true,
      then: (schema) => schema.required(t('loris.visitRequired')),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  return yup.object().shape({
    visitsForm: yup.array().of(visitsFormSchema).required(),
  });
};
