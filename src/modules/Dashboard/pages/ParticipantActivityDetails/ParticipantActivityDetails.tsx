import { useEffect, useMemo } from 'react';
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

export const ParticipantActivityDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appletId, participantId, activityId } = useParams();
  const { ownerId } = workspaces.useData() || {};
  const appletLoadingStatus = appletState.useResponseStatus();
  const respondentLoadingStatus = users.useRespondentStatus();
  const { useRespondent } = users;
  const { useAppletData } = appletState;
  const applet = useAppletData();
  const respondent = useRespondent();
  const { getApplet } = appletState.thunk;

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
    if (!loading && !respondent) {
      navigateUp();
    }
  }, [loading, respondent]);

  const currentActivity = useMemo(
    () => applet?.result.activities?.find((activity) => getEntityKey(activity) === activityId),
    [applet?.result?.activities],
  );

  return (
    <StyledBody>
      {loading && <Spinner />}
      {!loading && !!respondent && (
        <>
          <StyledFlexTopCenter
            sx={{
              display: 'flex',
              gap: theme.spacing(0.8),
              marginX: theme.spacing(3.2),
              marginTop: theme.spacing(1.2),
              marginBottom: theme.spacing(3.2),
            }}
          >
            <Svg id="arrow-navigate-left" width={24} height={24} />
            <StyledTitleLargish color={palette.on_surface_variant}>
              {respondent?.result.secretUserId}
            </StyledTitleLargish>
            <StyledTitleLargish color={palette.outline}>
              {respondent?.result.nickname}
            </StyledTitleLargish>
          </StyledFlexTopCenter>
          <StyledFlexTopCenter
            sx={{
              gap: theme.spacing(1.6),
              marginX: theme.spacing(3.2),
            }}
          >
            {!!currentActivity?.image && <StyledLogo src={currentActivity.image} />}
            <StyledHeadlineLarge>{currentActivity?.name}</StyledHeadlineLarge>
          </StyledFlexTopCenter>
        </>
      )}
    </StyledBody>
  );
};

export default ParticipantActivityDetails;
