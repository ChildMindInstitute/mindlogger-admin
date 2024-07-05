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
    buttonText: t('upload'),
    width: '88',
    content: <LorisVisits onSetIsLoading={setIsLoading} setStep={setStep} />,
    onSubmit: onSubmitVisits,
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
    for (let i = 0; i < errors.visitsForm.length; i++) {
      const activities = errors.visitsForm[i]?.activities;
      if (activities?.length) {
        for (let j = 0; j < activities.length; j++) {
          const visitError = get(errors, `visitsForm[${i}].activities[${j}].visit.message`);
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
  form.visitsForm.map((userVisit) => ({
    ...userVisit,
    activities: userVisit.activities.reduce((acc: LorisActivityForm[], activity) => {
      if (activity.selected) {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const { selected, ...rest } = activity;
        acc.push(rest);
      }

      return acc;
    }, []),
  }));
