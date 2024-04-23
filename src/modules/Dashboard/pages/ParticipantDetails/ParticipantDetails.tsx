import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { HeaderOptions } from 'modules/Dashboard/components/HeaderOptions';
import { useAppDispatch } from 'redux/store';
import { LinkedTabs, Spinner } from 'shared/components';
import { workspaces } from 'shared/state';
import { StyledBody, StyledHeadlineLarge } from 'shared/styles';
import { applet as appletState } from 'shared/state';
import { applets, users } from 'modules/Dashboard/state';
import { getSubjectDetails } from 'modules/Dashboard/state/Users/Users.thunk';
import { palette } from 'shared/styles/variables/palette';
import { page } from 'resources';

import { useParticipantDetailsTabs } from './ParticipantDetails.hooks';

export const ParticipantDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appletId, subjectId } = useParams();
  const { ownerId } = workspaces.useData() || {};
  const { useSubject, useSubjectStatus } = users;
  const appletLoadingStatus = appletState.useResponseStatus();
  const subjectLoadingStatus = useSubjectStatus();
  const { result: subject } = useSubject() ?? {};
  const { getApplet } = appletState.thunk;
  const respondentTabs = useParticipantDetailsTabs();

  useEffect(() => {
    if (!appletId) return;
    dispatch(getApplet({ appletId }));

    if (!subjectId || !ownerId) return;
    dispatch(getSubjectDetails({ subjectId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, subjectId, ownerId]);

  const loading =
    appletLoadingStatus === 'loading' ||
    appletLoadingStatus === 'idle' ||
    subjectLoadingStatus === 'loading' ||
    subjectLoadingStatus === 'idle';

  useEffect(() => {
    if (!loading && !subject) {
      navigate(generatePath(page.appletParticipants, { appletId }));
    }
  }, [loading, subject]);

  return (
    <StyledBody>
      {loading && <Spinner />}
      {!loading && !!subject && (
        <>
          <Box
            sx={{
              display: 'flex',
              gap: 1.6,
              marginBottom: 1.2,
              marginX: 2.4,
              placeContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.6 }}>
              <StyledHeadlineLarge>{subject?.secretUserId}</StyledHeadlineLarge>
              <StyledHeadlineLarge color={palette.outline}>{subject?.nickname}</StyledHeadlineLarge>
            </Box>

            <HeaderOptions />
          </Box>

          <LinkedTabs
            panelProps={{ sx: { padding: 0 } }}
            tabs={respondentTabs}
            isCentered={false}
            deepPathCompare
          />
        </>
      )}
    </StyledBody>
  );
};

export default ParticipantDetails;
