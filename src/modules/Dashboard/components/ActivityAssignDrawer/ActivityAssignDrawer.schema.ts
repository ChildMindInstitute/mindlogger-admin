import * as yup from 'yup';

export const useActivityAssignFormSchema = () =>
  yup
    .object({
      activityIds: yup.array(yup.string().required()).required(),
      flowIds: yup.array(yup.string().required()).required(),
      assignments: yup
        .array(
          yup.object({
            respondentSubjectId: yup.string().nullable(),
            targetSubjectId: yup.string().nullable(),
          }),
        )
        .required(),
    })
    .required();
