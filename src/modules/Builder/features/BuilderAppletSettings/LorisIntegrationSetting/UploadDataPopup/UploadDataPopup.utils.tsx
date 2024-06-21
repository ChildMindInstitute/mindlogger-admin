import i18n from 'i18n';
import { StyledBodyLarge, StyledTitleMedium, variables } from 'shared/styles';

import { ScreenParams, Steps } from './UploadDataPopup.types';
import { LorisVisits } from './LorisVisits';

const { t } = i18n;

export const getScreens = ({
  handleAcceptAgreement,
  onClose,
  handleSubmitVisits,
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
    content: <LorisVisits onSetIsLoading={setIsLoading} setStep={setStep} />,
    onSubmit: handleSubmitVisits,
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
