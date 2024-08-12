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
        .test('DuplicateRowsError', (assignments) => {
          const duplicates: string[] = [];
          const unique: Set<string> = new Set();

          assignments?.forEach(({ respondentSubjectId, targetSubjectId }) => {
            if (!respondentSubjectId || !targetSubjectId) {
              return;
            }
            const key = `${respondentSubjectId}_${targetSubjectId}`;
            if (unique.has(key)) {
              duplicates.push(key);
            } else {
              unique.add(key);
            }
          });

          if (duplicates.length > 0) {
            return new yup.ValidationError(
              duplicates.join(','),
              null,
              'assignments',
              'DuplicateRowsError',
            );
          }

          return true;
        })
        .required(),
    })
    .required();
