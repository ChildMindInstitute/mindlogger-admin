import { FieldErrors } from 'react-hook-form';
import get from 'lodash.get';

import i18n from 'i18n';
import { StyledBodyLarge, StyledTitleMedium, variables } from 'shared/styles';
import { LorisActivityForm, LorisUsersVisit } from 'modules/Builder/api';

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

export const findVisitErrorMessage = (
  errors: FieldErrors<{ visitsForm: LorisUsersVisit<LorisActivityForm>[] }>,
): string | null => {
  if (errors?.visitsForm?.length) {
    for (let user = 0; user < errors.visitsForm.length; user++) {
      const activities = errors.visitsForm[user]?.activities;
      if (activities?.length) {
        for (let activity = 0; activity < activities.length; activity++) {
          const visitError = get(
            errors,
            `visitsForm[${user}].activities[${activity}].visit.message`,
          );
          if (visitError) {
            return visitError;
          }
        }
      }
    }
  }

  return null;
};

export const filteredData = (form: UploadDataForm): LorisUsersVisit<LorisActivityForm>[] =>
  form.visitsForm
    .filter((userVisit) => userVisit.activities.some((activity) => activity.selected))
    .map((userVisit) => ({
      ...userVisit,
      activities: userVisit.activities.reduce((acc: LorisActivityForm[], activity) => {
        if (activity.selected) {
          // eslint-disable-next-line unused-imports/no-unused-vars
          const { selected, visits, ...rest } = activity;
          acc.push(rest);
        }

        return acc;
      }, []),
    }));
