import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from 'redux/store';
import { Spinner, Svg } from 'shared/components';
import { workspaces } from 'shared/state';
import {
  StyledBody,
  StyledFlexTopCenter,
  StyledLogo,
  StyledTitleLargish,
  StyledHeadlineLarge,
  theme,
} from 'shared/styles';
import { applet as appletState } from 'shared/state';
import { applets, users } from 'modules/Dashboard/state';
import { getRespondentDetails } from 'modules/Dashboard/state/Users/Users.thunk';
import { palette } from 'shared/styles/variables/palette';
import { page } from 'resources';
import { getEntityKey } from 'shared/utils';

import { StyledContainer } from './ParticipantActivityDetails.styles';

export const ParticipantActivityDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appletId, participantId, activityId } = useParams();
  const { ownerId } = workspaces.useData() || {};
  const appletLoadingStatus = appletState.useResponseStatus();
  const respondentLoadingStatus = users.useRespondentStatus();
  const { useRespondent } = users;
  const { useAppletData } = appletState;
  const { result: appletData } = useAppletData() ?? {};
  const { result: respondentData } = useRespondent() ?? {};
  const { getApplet } = appletState.thunk;
  const currentActivity = appletData?.activities?.find(
    (activity) => getEntityKey(activity) === activityId,
  );

  useEffect(() => {
    if (!appletId) return;
    dispatch(getApplet({ appletId }));

    if (!participantId || !ownerId) return;
    dispatch(getRespondentDetails({ ownerId, appletId, respondentId: participantId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, participantId, ownerId]);

  const navigateUp = () => {
    navigate(
      generatePath(page.appletParticipantActivities, {
        participantId,
        appletId,
      }),
    );
  };

  const loading =
    appletLoadingStatus === 'loading' ||
    appletLoadingStatus === 'idle' ||
    respondentLoadingStatus === 'loading' ||
    respondentLoadingStatus === 'idle';

  useEffect(() => {
    if (!loading && (!respondentData || !currentActivity)) navigateUp();
  }, [loading, respondentData, currentActivity]);

  return (
    <StyledBody>
      {loading && <Spinner />}
      {!loading && !!respondentData && !!currentActivity && (
        <>
          <StyledContainer>
            <StyledFlexTopCenter
              onClick={() => navigateUp()}
              sx={{ cursor: 'pointer', color: palette.on_surface_variant }}
            >
              <Svg id="arrow-navigate-left" width="2.4rem" height="2.4rem" />
            </StyledFlexTopCenter>
            <StyledTitleLargish color={palette.on_surface_variant}>
              {respondentData.secretUserId}
            </StyledTitleLargish>
            <StyledTitleLargish color={palette.outline}>
              {respondentData.nickname}
            </StyledTitleLargish>
          </StyledContainer>
          <StyledFlexTopCenter
            sx={{
              gap: theme.spacing(1.6),
              marginX: theme.spacing(3.2),
            }}
          >
            {!!currentActivity?.image && <StyledLogo src={currentActivity.image} />}
            <StyledHeadlineLarge color={palette.on_surface}>
              {currentActivity?.name}
            </StyledHeadlineLarge>
          </StyledFlexTopCenter>
        </>
      )}
    </StyledBody>
  );
};

export default ParticipantActivityDetails;
