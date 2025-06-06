import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';

import { page } from 'resources';
import { Svg } from 'shared/components/Svg';
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
import { getMessageColor } from './Notification.utils';

export const Notification = ({
  currentId,
  setCurrentId,
  id,
  workspace,
  appletId,
  appletName,
  image,
  secretId,
  message,
  timeAgo,
  isWatched,
  subjectId,
  type,
  activityId,
  answerId,
}: NotificationProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const isActive = currentId === id;
  const navigate = useNavigate();
  const dataTestid = `notification-${id}`;

  const handleNotificationClick = async () => {
    const { setAlertWatched } = alerts.thunk;
    setCurrentId(isActive ? '' : id);

    if (isWatched) return;

    await dispatch(
      alerts.actions.updateAlertWatchedState({
        id,
        isWatched: true,
      }),
    );
    const result = await dispatch(setAlertWatched(id));
    !setAlertWatched.fulfilled.match(result) &&
      (await dispatch(
        alerts.actions.updateAlertWatchedState({
          id,
          isWatched: false,
        }),
      ));
  };

  const navigateToResponseData = () => {
    navigate(
      generatePath(page.appletParticipantActivityDetailsDataReview, {
        appletId,
        subjectId,
        activityId,
        answerId,
      }),
    );
  };

  return (
    <>
      <StyledNotification
        active={isActive}
        onClick={handleNotificationClick}
        data-testid={dataTestid}
      >
        <StyledTopSection>
          <StyledLeftSection>
            <StyledImageWrapper>
              <WorkspaceImage
                coverSxProps={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: variables.borderRadius.half,
                }}
                workspaceName={workspace ?? ''}
              />
              {image ? (
                <StyledLogo src={image} alt={appletName} />
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
              {secretId}
            </StyledTitle>
            <StyledMessage color={getMessageColor(isActive, type)} isActive={isActive}>
              {message}
            </StyledMessage>
          </StyledInfo>
          <StyledRightSection>{!isWatched ? <StyledInfoCircle /> : <Box />}</StyledRightSection>
        </StyledTopSection>
        <StyledBottomSection>
          {isActive && type !== 'integration' && (
            <StyledBtn
              variant="contained"
              startIcon={<Svg width="16.5" height="16.5" id="data-outlined" />}
              onClick={navigateToResponseData}
              aria-label="takeMeToTheResponseData"
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
    </>
  );
};
