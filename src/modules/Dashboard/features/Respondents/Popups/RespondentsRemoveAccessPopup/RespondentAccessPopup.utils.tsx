import { Trans } from 'react-i18next';

import { SubmitBtnColor } from 'shared/components';
import { StyledBodyLarge, theme, variables } from 'shared/styles';

import { GetScreen, Screen, ScreensParams } from './RespondentsRemoveAccessPopup.types';

const getThirdScreen = (respondentName: string, appletName: string) => (
  <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
    <Trans i18nKey="confirmRemoveRespondentAccess">
      Are you sure you want to remove access for Respondent
      <b>
        <>{{ respondentName }}</>
      </b>
      's to the
      <b>
        <>{{ appletName }}</>
      </b>
      Applet?
    </Trans>
  </StyledBodyLarge>
);

const getFourthExtScreen = (respondentName: string, appletName: string) => (
  <StyledBodyLarge>
    <Trans i18nKey="confirmRemoveRespondentAccessAndData">
      Are you sure you want to to remove Respondent
      <b>
        <> {{ respondentName }}</>
      </b>
      's access and all response data within Applet
      <b>
        <> {{ appletName }}</>
      </b>
      ?
    </Trans>
  </StyledBodyLarge>
);

const getFourthScreen = (respondentName: string, appletName: string) => (
  <StyledBodyLarge>
    <Trans i18nKey="respondentAccessRemoveSuccess">
      Respondent
      <b>
        <>{{ respondentName }}</>
      </b>
      's access to
      <b>
        <> {{ appletName }} </>
      </b>
      has been removed successfully.
    </Trans>
  </StyledBodyLarge>
);

const getFourthErrorScreen = (respondentName: string, appletName: string) => (
  <StyledBodyLarge color={variables.palette.semantic.error}>
    <Trans i18nKey="respondentAccessRemoveError">
      Respondent
      <b>
        <> {{ respondentName }}</>
      </b>
      's access to Applet
      <b>
        <> {{ appletName }} </>
      </b>
      has not been removed. Please try again.
    </Trans>
  </StyledBodyLarge>
);

const getFifthExtScreen = (respondentName: string, appletName: string) => (
  <StyledBodyLarge>
    <Trans i18nKey="respondentAccessAndDataRemoveSuccess">
      Respondent
      <b>
        <> {{ respondentName }}</>
      </b>
      's access and all response data within Applet
      <b>
        <>{{ appletName }}</>
      </b>
      have been removed successfully.
    </Trans>
  </StyledBodyLarge>
);

const getFifthExtScreenError = (respondentName: string, appletName: string) => (
  <StyledBodyLarge color={variables.palette.semantic.error}>
    <Trans i18nKey="respondentAccessAndDataRemoveError">
      Respondent
      <b>
        <>{{ respondentName }}</>
      </b>
      ’s access and all response data within Applet
      <b>
        <>{{ appletName }}</>
      </b>
      have not been removed. Please try again.
    </Trans>
  </StyledBodyLarge>
);

export const getScreens = ({
  firstScreen,
  secondScreen,
  thirdExtScreen,
  respondentName,
  appletName,
  removeData,
  isRemoved,
  submitPassword,
  removeAccess,
  onClose,
}: ScreensParams): Screen[] => {
  const onCloseHandler = () => onClose(true);

  const getResultScreen = (getSuccessScreen: GetScreen, getErrorScreen: GetScreen, title: string) =>
    isRemoved
      ? {
          component: getSuccessScreen(respondentName, appletName),
          buttonText: 'ok',
          hasSecondBtn: false,
          title,
          submitForm: onCloseHandler,
          onClose: onCloseHandler,
        }
      : {
          component: getErrorScreen(respondentName, appletName),
          buttonText: 'retry',
          hasSecondBtn: true,
          title,
          submitForm: removeAccess,
        };

  return [
    { component: firstScreen, buttonText: '', hasSecondBtn: false, title: 'removeAccess' },
    {
      component: secondScreen,
      buttonText: removeData ? 'removeAccessAndData' : 'removeAccess',
      hasSecondBtn: true,
      title: 'removeAccess',
      submitBtnColor: 'error',
    },
    ...(removeData
      ? [
          {
            component: thirdExtScreen,
            buttonText: 'submit',
            hasSecondBtn: true,
            title: 'enterAppletPassword',
            submitForm: submitPassword,
          },
          {
            component: getFourthExtScreen(respondentName, appletName),
            buttonText: 'yesRemove',
            hasSecondBtn: true,
            title: 'removeAccessAndData',
            submitForm: removeAccess,
            submitBtnColor: 'error' as SubmitBtnColor,
          },
          getResultScreen(getFifthExtScreen, getFifthExtScreenError, 'removeAccessAndData'),
        ]
      : [
          {
            component: getThirdScreen(respondentName, appletName),
            buttonText: 'yesRemove',
            hasSecondBtn: true,
            title: 'removeAccess',
            submitForm: removeAccess,
            submitBtnColor: 'error' as SubmitBtnColor,
          },
          getResultScreen(getFourthScreen, getFourthErrorScreen, 'removeAccess'),
        ]),
  ];
};
