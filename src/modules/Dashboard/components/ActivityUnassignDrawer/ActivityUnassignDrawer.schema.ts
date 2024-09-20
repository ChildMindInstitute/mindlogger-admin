import * as yup from 'yup';

export const useActivityUnassignFormSchema = () =>
  yup
    .object({
      selectedAssignments: yup.array().min(1).required(),
    })
    .required();
