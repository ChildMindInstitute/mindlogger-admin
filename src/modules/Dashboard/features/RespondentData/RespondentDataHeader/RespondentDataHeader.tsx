import { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { Chip, ChipShape, Svg, Tooltip } from 'shared/components';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import {
  StyledActivityThumbnailContainer,
  StyledActivityThumbnailImg,
  StyledFlexSpaceBetween,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  StyledHeadlineLarge,
  theme,
  variables,
} from 'shared/styles';
import {
  Mixpanel,
  checkIfFullAccess,
  getIsWebSupported,
  MixpanelEventType,
  MixpanelProps,
  StartAssignActivityOrFlowEvent,
} from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { useTakeNowModal } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal';
import { workspaces } from 'redux/modules';
import { page } from 'resources';
import { palette } from 'shared/styles/variables/palette';
import { hasPermissionToViewData } from 'modules/Dashboard/pages/RespondentData/RespondentData.utils';
import { NavigationEyebrow } from 'shared/components/NavigationEyebrow';
import { ItemResponseType, TEAM_MEMBER_ROLES } from 'shared/consts';
import { ActivityFlowThumbnail, ActivityAssignDrawer } from 'modules/Dashboard/components';

import { RespondentDataHeaderProps } from './RespondentDataHeader.types';

const dataTestId = 'respondent-data-header';

export const RespondentDataHeader = ({
  dataTestid,
  applet,
  activityOrFlow,
  subject,
}: RespondentDataHeaderProps) => {
  const { appletId, activityId, activityFlowId } = useParams();
  const { featureFlags } = useFeatureFlags();
  const [showActivityAssign, setShowActivityAssign] = useState(false);
  const { t } = useTranslation('app');
  const i18nKeyInfix = activityOrFlow && 'activities' in activityOrFlow ? 'Flow' : 'Activity';

  const rolesData = workspaces.useRolesData();
  const roles = appletId ? rolesData?.data?.[appletId] : undefined;

  const [isExportOpen, setIsExportOpen] = useState(false);
  const { TakeNowModal, openTakeNowModal } = useTakeNowModal({ dataTestId });
  const navigate = useNavigate();

  let items: { responseType: ItemResponseType }[] = [];
  if (activityOrFlow) {
    if ('activities' in activityOrFlow) {
      items = activityOrFlow.activities.reduce<{ responseType: ItemResponseType }[]>(
        (items, activity) => [...items, ...activity.items],
        [],
      );
    } else {
      items = activityOrFlow.items;
    }
  }
  const isWebSupported = getIsWebSupported(items);

  const navigateUp = () =>
    navigate(
      generatePath(activityOrFlow ? page.appletParticipantDetails : page.appletParticipants, {
        appletId,
        subjectId: subject.id,
      }),
    );

  const handleTakeNow = () => {
    if (!activityOrFlow) return;

    openTakeNowModal(activityOrFlow, {
      targetSubject: {
        id: subject.id,
        userId: subject.userId,
        secretId: subject.secretUserId,
        nickname: subject.nickname,
        isTeamMember: subject.roles.some((role) => TEAM_MEMBER_ROLES.includes(role)),
        roles: subject.roles,
      },
    });
  };

  const handleAssignActivity = () => {
    setShowActivityAssign(true);
    const event: StartAssignActivityOrFlowEvent = {
      action: MixpanelEventType.StartAssignActivityOrFlow,
      [MixpanelProps.AppletId]: appletId,
      [MixpanelProps.Via]: 'Data Viz',
    };

    if (activityId) {
      event[MixpanelProps.ActivityId] = activityId;
      event[MixpanelProps.EntityType] = 'activity';
    } else if (activityFlowId) {
      event[MixpanelProps.ActivityFlowId] = activityFlowId;
      event[MixpanelProps.EntityType] = 'flow';
    }

    Mixpanel.track(event);
  };

  const handleOpenExport = () => {
    setIsExportOpen(true);
    Mixpanel.track({ action: MixpanelEventType.ExportDataClick });
  };

  const handleCloseExport = () => {
    setIsExportOpen(false);
  };

  const canDoTakeNow = activityOrFlow && checkIfFullAccess(roles);

  const canViewData = hasPermissionToViewData(roles);

  const headerElements = {
    name: applet.displayName,
    image: applet.image ? (
      <StyledActivityThumbnailImg src={applet.image} alt={applet.displayName} />
    ) : null,
  };
  if (activityOrFlow) {
    headerElements.name = activityOrFlow.name;

    if ('activities' in activityOrFlow) {
      headerElements.image = (
        <ActivityFlowThumbnail
          sx={{ width: '4.8rem', height: '4.8rem' }}
          activities={activityOrFlow.activities}
        />
      );
    } else if (activityOrFlow.image) {
      headerElements.image = (
        <StyledActivityThumbnailImg src={activityOrFlow.image} alt={activityOrFlow.name} />
      );
    }
  }

  return (
    <>
      <StyledFlexTopStart sx={{ margin: theme.spacing(1.2, 3.2, 3.2) }}>
        <NavigationEyebrow title={t('back')} onClick={navigateUp} />
      </StyledFlexTopStart>

      <StyledFlexSpaceBetween sx={{ gap: 1.6, margin: theme.spacing(0, 3.2, 0.8) }}>
        <StyledFlexTopCenter sx={{ gap: 1.6 }}>
          <StyledActivityThumbnailContainer sx={{ width: '4.8rem', height: '4.8rem' }}>
            {headerElements.image}
          </StyledActivityThumbnailContainer>
          <StyledHeadlineLarge color={palette.on_surface}>
            {headerElements.name}
          </StyledHeadlineLarge>
          <Chip
            icon={<Svg id="respondent-circle" width={18} height={18} />}
            color={'secondary'}
            shape={ChipShape.Rectangular}
            sx={{ py: 0.5, height: 'auto', px: 1, alignItems: 'end' }}
            title={subject?.secretUserId || ''}
          />
        </StyledFlexTopCenter>
        {canViewData && (
          <StyledFlexTopCenter sx={{ gap: 1 }}>
            <Button
              variant="text"
              data-testid={`${dataTestid}-export-button`}
              onClick={handleOpenExport}
              startIcon={<Svg id="export" width={18} height={18} />}
              sx={{ color: variables.palette.on_surface_variant }}
            >
              {t('export')}
            </Button>

            <ExportDataSetting
              isExportSettingsOpen={isExportOpen}
              onExportSettingsClose={handleCloseExport}
            />
            {featureFlags.enableActivityAssign && (
              <Tooltip
                tooltipTitle={activityOrFlow?.autoAssign && t(`autoAssign${i18nKeyInfix}Disabled`)}
              >
                <span>
                  <Button
                    variant="tonal"
                    onClick={handleAssignActivity}
                    data-testid={`${dataTestid}-assign-activity`}
                    disabled={activityOrFlow?.autoAssign}
                  >
                    {t('assign')}
                  </Button>
                </span>
              </Tooltip>
            )}
            {canDoTakeNow && (
              <Tooltip tooltipTitle={!isWebSupported && t('activityIsMobileOnly')}>
                <span>
                  <Button
                    disabled={!isWebSupported}
                    data-testid={`${dataTestid}-take-now`}
                    onClick={handleTakeNow}
                    variant="contained"
                  >
                    {t('takeNow.buttonLabel')}
                  </Button>
                </span>
              </Tooltip>
            )}
          </StyledFlexTopCenter>
        )}
      </StyledFlexSpaceBetween>

      <ActivityAssignDrawer
        appletId={appletId}
        activityId={activityId}
        activityFlowId={activityFlowId}
        open={showActivityAssign}
        respondentSubjectId={subject.userId ? subject.id : undefined}
        targetSubjectId={subject.tag === 'Team' ? undefined : subject.id}
        onClose={() => setShowActivityAssign(false)}
      />

      {canDoTakeNow && <TakeNowModal />}
    </>
  );
};
