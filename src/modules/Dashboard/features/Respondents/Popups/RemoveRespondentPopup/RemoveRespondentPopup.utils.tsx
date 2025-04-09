import { Trans } from 'react-i18next';

import { StyledBodyLarge, theme, variables } from 'shared/styles';
import { SubmitBtnColor } from 'shared/components';

import { GetScreen, Screen, ScreensParams } from './RemoveRespondentPopup.types';

const getThirdScreen = (respondentName: string, appletName: string) => (
  <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
    <Trans i18nKey="confirmRemoveRespondentAccess">
      Are you sure you want to to remove
      <b>
        <>{{ respondentName }}</>
      </b>
      from Applet
      <b>
        <>{{ appletName }}</>
      </b>
      ?
    </Trans>
  </StyledBodyLarge>
);

const getFourthExtScreen = (respondentName: string, appletName: string) => (
  <StyledBodyLarge>
    <Trans i18nKey="confirmRemoveRespondentAccessAndData">
      Are you sure you want to to remove
      <b>
        <> {{ respondentName }}</>
      </b>
      and all of their response data from Applet
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
      <b>
        <>{{ respondentName }}</>
      </b>
      has been removed successfully from Applet
      <b>
        <> {{ appletName }} </>
      </b>
      .
    </Trans>
  </StyledBodyLarge>
);

const getFourthErrorScreen = (respondentName: string, appletName: string) => (
  <StyledBodyLarge color={variables.palette.semantic.error}>
    <Trans i18nKey="respondentAccessRemoveError">
      <b>
        <> {{ respondentName }}</>
      </b>
      has not been removed from Applet
      <b>
        <> {{ appletName }} </>
      </b>
      . Please try again.
    </Trans>
  </StyledBodyLarge>
);

const getFifthExtScreen = (respondentName: string, appletName: string) => (
  <StyledBodyLarge>
    <Trans i18nKey="respondentAccessAndDataRemoveSuccess">
      <b>
        <> {{ respondentName }}</>
      </b>
      and all of their response data have been removed successfully from Applet
      <b>
        <>{{ appletName }}</>
      </b>
      .
    </Trans>
  </StyledBodyLarge>
);

const getFifthExtScreenError = (respondentName: string) => (
  <StyledBodyLarge color={variables.palette.semantic.error}>
    <Trans i18nKey="respondentAccessAndDataRemoveError">
      <b>
        <>{{ respondentName }}</>
      </b>
      and all of their response data have not been removed. Please try again.
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
  const getResultScreen = (
    getSuccessScreen: GetScreen,
    getErrorScreen: GetScreen,
    title: string,
  ) =>
    isRemoved
      ? {
          component: getSuccessScreen(respondentName, appletName),
          buttonText: 'ok',
          hasSecondBtn: false,
          title,
          submitForm: onClose,
          onClose,
        }
      : {
          component: getErrorScreen(respondentName, appletName),
          buttonText: 'retry',
          hasSecondBtn: true,
          title,
          submitForm: removeAccess,
        };

  return [
    { component: firstScreen, buttonText: '', hasSecondBtn: false, title: 'removeFromApplet' },
    {
      component: secondScreen,
      buttonText: removeData ? 'removeFromAppletAndData' : 'removeFromApplet',
      hasSecondBtn: true,
      title: 'removeFromApplet',
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
            title: 'removeFromAppletAndData',
            submitForm: removeAccess,
            submitBtnColor: 'error' as SubmitBtnColor,
          },
          getResultScreen(getFifthExtScreen, getFifthExtScreenError, 'removeFromAppletAndData'),
        ]
      : [
          {
            component: getThirdScreen(respondentName, appletName),
            buttonText: 'yesRemove',
            hasSecondBtn: true,
            title: 'removeFromApplet',
            submitForm: removeAccess,
            submitBtnColor: 'error' as SubmitBtnColor,
          },
          getResultScreen(getFourthScreen, getFourthErrorScreen, 'removeFromApplet'),
        ]),
  ];
};
