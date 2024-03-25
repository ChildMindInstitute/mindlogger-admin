import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { LinkedTabs, Spinner } from 'shared/components';
import { workspaces } from 'shared/state';
import { StyledBody, StyledHeadlineLarge, theme } from 'shared/styles';
import { applet as appletState } from 'shared/state';
import { applets, users } from 'modules/Dashboard/state';
import { getRespondentDetails } from 'modules/Dashboard/state/Users/Users.thunk';
import { palette } from 'shared/styles/variables/palette';
import { page } from 'resources';

import { useParticipantDetailsTabs } from './ParticipantDetails.hooks';

export const ParticipantDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const respondentTabs = useParticipantDetailsTabs();
  const { appletId, participantId } = useParams();
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
      generatePath(page.appletRespondents, {
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

  return (
    <StyledBody>
      {loading && <Spinner />}
      {!loading && !!respondent && (
        <>
          <Box
            sx={{
              display: 'flex',
              gap: theme.spacing(1.6),
              marginX: theme.spacing(2.4),
              marginBottom: theme.spacing(1.2),
            }}
          >
            <StyledHeadlineLarge>{respondent?.result.secretUserId}</StyledHeadlineLarge>
            <StyledHeadlineLarge color={palette.outline}>
              {respondent?.result.nickname}
            </StyledHeadlineLarge>
          </Box>
          <LinkedTabs tabs={respondentTabs} isCentered={false} deepPathCompare />
        </>
      )}
    </StyledBody>
  );
};

export default ParticipantDetails;
