import { useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { page } from 'resources';
import { useEncryptionStorage } from 'shared/hooks';
import { Svg } from 'shared/components';
import { AppletPasswordPopup } from 'modules/Dashboard/features/Applet';
import { useAppDispatch } from 'redux/store';
import { StyledLabelMedium, StyledLabelSmall, variables } from 'shared/styles';
import { alerts } from 'shared/state';
import { WorkspaceImage } from 'shared/features/SwitchWorkspace';

import {
  StyledNotification,
  StyledLeftSection,
  StyledImageWrapper,
  StyledInfo,
  StyledRightSection,
  StyledInfoCircle,
  StyledTimeAgo,
  StyledLogo,
  StyledMessage,
  StyledTitle,
  StyledTopSection,
  StyledBottomSection,
  StyledBtn,
  StyledLogoPlug,
} from './Notification.styles';
import { NotificationProps } from './Notification.types';

export const Notification = ({
  currentId,
  setCurrentId,
  alertId,
  workspaceName,
  appletId,
  appletName,
  appletImage,
  respondentSecretId,
  message,
  timeAgo,
  isWatched,
  respondentId,
  encryption,
  alert,
}: NotificationProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const isActive = currentId === alertId;
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);
  const navigate = useNavigate();
  const { getAppletPrivateKey } = useEncryptionStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');

  const handleNotificationClick = async () => {
    const { setAlertWatched } = alerts.thunk;
    setCurrentId(isActive ? '' : alertId);

    if (alert.isWatched) return;

    await dispatch(
      alerts.actions.updateAlertWatchedState({
        id: alert.id,
        isWatched: true,
      }),
    );
    const result = await dispatch(setAlertWatched(alertId));
    !setAlertWatched.fulfilled.match(result) &&
      (await dispatch(
        alerts.actions.updateAlertWatchedState({
          id: alert.id,
          isWatched: false,
        }),
      ));
  };

  const navigateToResponseData = () => {
    navigate(generatePath(page.appletRespondentDataSummary, { appletId, respondentId }));
  };
  const handleToResponseDataClick = () => {
    if (hasEncryptionCheck) return navigateToResponseData();
    setPasswordPopupVisible(true);
  };

  const handleSubmit = () => {
    setPasswordPopupVisible(false);
    navigateToResponseData();
  };

  return (
    <>
      <StyledNotification active={isActive} onClick={handleNotificationClick}>
        <StyledTopSection>
          <StyledLeftSection>
            <StyledImageWrapper>
              <WorkspaceImage
                coverSxProps={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '100%',
                }}
                workspaceName={workspaceName ?? ''}
              />
              {appletImage ? (
                <StyledLogo src={appletImage} alt={appletName} />
              ) : (
                <StyledLogoPlug>
                  <StyledLabelSmall color={variables.palette.on_surface}>
                    {appletName.substring(0, 1).toUpperCase()}
                  </StyledLabelSmall>
                </StyledLogoPlug>
              )}
            </StyledImageWrapper>
          </StyledLeftSection>
          <StyledInfo>
            <StyledLabelMedium
              fontWeight={isWatched ? 'regular' : 'bold'}
              color={variables.palette.on_surface_variant}
            >
              {appletName}
            </StyledLabelMedium>
            <StyledTitle
              fontWeight={isWatched ? 'regular' : 'bold'}
              color={
                isActive ? variables.palette.on_secondary_container : variables.palette.on_surface
              }
            >
              {respondentSecretId}
            </StyledTitle>
            <StyledMessage
              color={
                isActive ? variables.palette.on_secondary_container : variables.palette.on_surface
              }
              isActive={isActive}
            >
              {message}
            </StyledMessage>
          </StyledInfo>
          <StyledRightSection>{!isWatched ? <StyledInfoCircle /> : <Box />}</StyledRightSection>
        </StyledTopSection>
        <StyledBottomSection>
          {isActive && (
            <StyledBtn
              variant="contained"
              startIcon={<Svg width="16.5" height="16.5" id="data-outlined" />}
              onClick={handleToResponseDataClick}
            >
              {t('takeMeToTheResponseData')}
            </StyledBtn>
          )}
          <StyledTimeAgo
            fontWeight={isWatched ? 'regular' : 'bold'}
            color={
              isWatched ? variables.palette.on_surface_variant : variables.palette.semantic.error
            }
          >
            {timeAgo}
          </StyledTimeAgo>
        </StyledBottomSection>
      </StyledNotification>
      {passwordPopupVisible && (
        <AppletPasswordPopup
          appletId={appletId ?? ''}
          popupVisible={passwordPopupVisible}
          onClose={() => setPasswordPopupVisible(false)}
          encryption={encryption}
          submitCallback={handleSubmit}
        />
      )}
    </>
  );
};
