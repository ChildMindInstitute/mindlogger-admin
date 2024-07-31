import { FieldErrors, get } from 'react-hook-form';

import i18n from 'i18n';
import { StyledBodyLarge, StyledTitleMedium, variables } from 'shared/styles';
import { LorisUsersVisit } from 'modules/Builder/api';

import { ScreenParams, Steps, UploadDataForm } from './UploadDataPopup.types';
import { LorisVisits } from './LorisVisits';

const { t } = i18n;

export const getScreens = ({
  handleAcceptAgreement,
  onClose,
  onSubmitVisits,
  setIsLoading,
  visitsData,
  setVisitsData,
  setStep,
}: ScreenParams) => [
  {
    buttonText: t('loris.agree'),
    content: (
      <StyledTitleMedium sx={{ whiteSpace: 'pre-line', color: variables.palette.on_surface }}>
        {t('loris.agreementText')}
      </StyledTitleMedium>
    ),
    onSubmit: handleAcceptAgreement,
  },
  {
    buttonText: visitsData?.length ? t('upload') : t('ok'),
    width: visitsData?.length ? '88' : '66',
    content: (
      <LorisVisits onSetIsLoading={setIsLoading} setVisitsData={setVisitsData} setStep={setStep} />
    ),
    onSubmit: visitsData?.length ? onSubmitVisits : onClose,
  },
  {
    buttonText: t('ok'),
    content: (
      <StyledTitleMedium sx={{ whiteSpace: 'pre-line' }} color={variables.palette.on_surface}>
        {t('loris.successMessage')}
      </StyledTitleMedium>
    ),
    onSubmit: onClose,
  },
  {
    buttonText: t('retry'),
    content: (
      <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
        {t('errorFallback.somethingWentWrong')}
      </StyledBodyLarge>
    ),
    onSubmit: () => setStep(Steps.Visits),
    hasSecondBtn: true,
    secondBtnText: t('cancel'),
    onSecondBtnSubmit: onClose,
  },
];

export const findVisitErrorMessage = (errors: FieldErrors<UploadDataForm>): string | null => {
  if (!errors?.visitsForm?.length) return null;
  for (let i = 0; i < errors.visitsForm.length; i++) {
    const visitError = get(errors, `visitsForm[${i}].visit.message`);
    if (visitError) {
      return visitError;
    }
  }

  return null;
};

export const filteredData = (form: UploadDataForm): LorisUsersVisit[] => {
  const filteredData = form?.visitsForm.reduce(
    (acc: { [key: string]: LorisUsersVisit }, activityAnswer) => {
      if (!activityAnswer.selected || !activityAnswer.visit) return acc;
      if (!acc[activityAnswer.userId]) {
        acc[activityAnswer.userId] = {
          userId: activityAnswer.userId,
          secretUserId: activityAnswer.secretUserId,
          activities: [],
        };
      }

      acc[activityAnswer.userId].activities.push({
        activityId: activityAnswer.activityId,
        activityName: activityAnswer.activityName,
        answerId: activityAnswer.answerId,
        version: activityAnswer.version,
        completedDate: activityAnswer.completedDate,
        visit: activityAnswer.visit,
      });

      return acc;
    },
    {},
  );

  return Object.values(filteredData);
};
