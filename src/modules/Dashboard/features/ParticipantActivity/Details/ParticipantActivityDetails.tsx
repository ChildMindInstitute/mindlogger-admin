import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'redux/store';
import { Chip, ChipShape, EmptyState, LinkedTabs, Spinner, Svg } from 'shared/components';
import { workspaces } from 'shared/state';
import {
  StyledFlexTopCenter,
  StyledLogo,
  StyledHeadlineLarge,
  theme,
  StyledBodyLarge,
  StyledFlexSpaceBetween,
} from 'shared/styles';
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
import { hasPermissionToViewData } from '../ParticipantActivity.utils';

export const ParticipantActivityDetails = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appletId, subjectId, activityId } = useParams();
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: defaultRespondentDataFormValues,
  });
  const rolesData = workspaces.useRolesData();
  const appletRoles = appletId ? rolesData?.data?.[appletId] : undefined;

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
  const canViewData = hasPermissionToViewData(appletRoles);

  return (
    <FormProvider {...methods}>
      {loading && <Spinner />}
      {!loading && !!currentActivity && (
        <>
          <StyledContainer
            onClick={() => navigateUp()}
            sx={{ cursor: 'pointer', color: palette.on_surface_variant }}
          >
            <Svg id="arrow-navigate-left" width="2.4rem" height="2.4rem" />
            <StyledBodyLarge sx={{ px: 1, color: palette.on_surface_variant }}>
              {t('back')}
            </StyledBodyLarge>
          </StyledContainer>

          <StyledFlexSpaceBetween
            sx={{
              gap: theme.spacing(1.6),
              margin: theme.spacing(0, 2.4, 0.8),
            }}
          >
            <StyledFlexTopCenter
              sx={{
                gap: theme.spacing(1.6),
              }}
            >
              {!!currentActivity?.image && <StyledLogo src={currentActivity.image} />}
              <StyledHeadlineLarge color={palette.on_surface}>
                {currentActivity?.name}
              </StyledHeadlineLarge>
              <Chip
                icon={<Svg id="respondent-circle" width={18} height={18} />}
                color={'secondary'}
                shape={ChipShape.Rectangular}
                sx={{ py: 0.5, height: 'auto', px: 1, alignItems: 'end' }}
                title={subject?.secretUserId || ''}
              />
            </StyledFlexTopCenter>

            <HeaderOptions />
          </StyledFlexSpaceBetween>

          {canViewData ? (
            <LinkedTabs tabs={activityDetailsTabs} isCentered={false} deepPathCompare />
          ) : (
            <EmptyState width="25rem">{t('noPermissions')}</EmptyState>
          )}
        </>
      )}
    </FormProvider>
  );
};

export default ParticipantActivityDetails;
