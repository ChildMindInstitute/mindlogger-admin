import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { LinkedTabs, Spinner } from 'shared/components';
import { workspaces } from 'shared/state';
import { StyledBody, StyledHeadlineLarge, theme } from 'shared/styles';
import { applet } from 'shared/state';
import { applets, users } from 'modules/Dashboard/state';
import { getRespondentDetails } from 'modules/Dashboard/state/Users/Users.thunk';
import { palette } from 'shared/styles/variables/palette';
import { page } from 'resources';

import { useRespondentDetailsTabs } from './RespondentDetails.hooks';

export const RespondentDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const respondentTabs = useRespondentDetailsTabs();
  const { appletId, respondentId } = useParams();
  const { ownerId } = workspaces.useData() || {};
  const appletLoadingStatus = applet.useResponseStatus();
  const respondentLoadingStatus = users.useRespondentStatus();
  const { useRespondent } = users;
  const respondent = useRespondent();
  const { getApplet } = applet.thunk;

  useEffect(() => {
    if (!appletId) return;
    const { getEvents } = applets.thunk;
    dispatch(getApplet({ appletId }));
    dispatch(getEvents({ appletId, respondentId }));

    if (!respondentId || !ownerId) return;
    dispatch(getRespondentDetails({ ownerId, appletId, respondentId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, respondentId, ownerId]);

  const navigateUp = () =>
    navigate(
      generatePath(page.appletRespondents, {
        appletId,
      }),
    );

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
            display="flex"
            gap={1}
            marginX={theme.spacing(2.4)}
            marginBottom={theme.spacing(1.2)}
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

export default RespondentDetails;
