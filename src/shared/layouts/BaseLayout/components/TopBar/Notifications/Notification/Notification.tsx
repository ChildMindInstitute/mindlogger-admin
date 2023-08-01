import { useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { AppletPasswordPopup } from 'modules/Dashboard/features/Applet';
import { useAppDispatch } from 'redux/store';
import logoSrc from 'assets/images/logo.png';
import { StyledLabelMedium, variables } from 'shared/styles';
import { alerts } from 'shared/state';

import {
  StyledNotification,
  StyledLeftSection,
  StyledImageWrapper,
  StyledImage,
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
} from './Notification.styles';
import { NotificationProps } from './Notification.types';

export const Notification = ({
  currentId,
  setCurrentId,
  alertId,
  label,
  title,
  message,
  imageSrc,
  timeAgo,
  viewed,
  encryption,
  appletId,
  alert,
}: NotificationProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const isActive = currentId === alertId;
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);

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
  const handleToResponseDataClick = () => setPasswordPopupVisible(true);

  return (
    <>
      <StyledNotification active={isActive} onClick={handleNotificationClick}>
        <StyledTopSection>
          <StyledLeftSection>
            <StyledImageWrapper>
              {imageSrc && <StyledImage src={imageSrc} alt={label} />}
              <StyledLogo src={logoSrc} alt={label} />
            </StyledImageWrapper>
          </StyledLeftSection>
          <StyledInfo>
            <StyledLabelMedium
              fontWeight={isActive ? 'regular' : 'bold'}
              color={variables.palette.on_surface_variant}
            >
              {label}
            </StyledLabelMedium>
            <StyledTitle
              fontWeight={isActive ? 'regular' : 'bold'}
              color={
                isActive ? variables.palette.on_secondary_container : variables.palette.on_surface
              }
            >
              {title}
            </StyledTitle>
            <StyledMessage
              fontWeight={isActive ? 'regular' : 'bold'}
              color={
                isActive ? variables.palette.on_secondary_container : variables.palette.on_surface
              }
              isActive={isActive}
            >
              {message}
            </StyledMessage>
          </StyledInfo>
          <StyledRightSection>{!viewed ? <StyledInfoCircle /> : <Box />}</StyledRightSection>
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
            fontWeight={isActive ? 'regular' : 'bold'}
            color={viewed ? variables.palette.on_surface_variant : variables.palette.semantic.error}
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
        />
      )}
    </>
  );
};
