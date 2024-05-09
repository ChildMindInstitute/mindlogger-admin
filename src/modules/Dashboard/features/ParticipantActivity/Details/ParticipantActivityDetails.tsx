import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';

import { useAppDispatch } from 'redux/store';
import { LinkedTabs, Spinner, Svg } from 'shared/components';
import { workspaces } from 'shared/state';
import { StyledFlexTopCenter, StyledLogo, StyledHeadlineLarge, theme } from 'shared/styles';
import { applet as appletState } from 'shared/state';
import { applets, users } from 'modules/Dashboard/state';
import { getRespondentDetails, getSubjectDetails } from 'modules/Dashboard/state/Users/Users.thunk';
import { palette } from 'shared/styles/variables/palette';
import { page } from 'resources';
import { getEntityKey } from 'shared/utils';
import { RespondentsDataFormValues } from 'modules/Dashboard/features/RespondentData';
import { defaultRespondentDataFormValues } from 'modules/Dashboard/features/RespondentData/RespondentData.const';
import { HeaderOptions } from 'modules/Dashboard/components/HeaderOptions';

import { useParticipantActivityDetailsTabs } from './ParticipantActivityDetails.hooks';
import { StyledContainer } from '../ParticipantActivity.styles';

export const ParticipantActivityDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appletId, subjectId, activityId } = useParams();
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: defaultRespondentDataFormValues,
  });

  const { ownerId } = workspaces.useData() || {};
  const { useAppletData } = appletState;
  const { result: appletData } = useAppletData() ?? {};
  const { getApplet } = appletState.thunk;
  const currentActivity = appletData?.activities?.find(
    (activity) => getEntityKey(activity) === activityId,
  );
  const { useSubject, useSubjectStatus } = users;
  const subjectLoadingStatus = useSubjectStatus();
  const { result: subject } = useSubject() ?? {};
  const activityDetailsTabs = useParticipantActivityDetailsTabs();

  useEffect(() => {
    if (!appletId) return;
    dispatch(getApplet({ appletId }));

    if (!subjectId || !ownerId) return;
    dispatch(getRespondentDetails({ ownerId, appletId, respondentId: subjectId }));

    dispatch(getSubjectDetails({ subjectId }));

    return () => {
      dispatch(applets.actions.resetEventsData());
    };
  }, [appletId, subjectId, ownerId]);

  const navigateUp = () => {
    navigate(
      generatePath(page.appletParticipantActivities, {
        subjectId,
        appletId,
      }),
    );
  };

  const loading = subjectLoadingStatus === 'loading' || subjectLoadingStatus === 'idle';

  useEffect(() => {
    if (!loading && !currentActivity) navigateUp();
  }, [loading, currentActivity]);

  return (
    <FormProvider {...methods}>
      {loading && <Spinner />}
      {!loading && !!currentActivity && (
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

          <StyledContainer>
            <StyledFlexTopCenter
              onClick={() => navigateUp()}
              sx={{ cursor: 'pointer', color: palette.on_surface_variant }}
            >
              <Svg id="arrow-navigate-left" width="2.4rem" height="2.4rem" />
            </StyledFlexTopCenter>
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
          <LinkedTabs
            panelProps={{ sx: { padding: 0 } }}
            tabs={activityDetailsTabs}
            isCentered={false}
            deepPathCompare
          />
        </>
      )}
    </FormProvider>
  );
};

export default ParticipantActivityDetails;
