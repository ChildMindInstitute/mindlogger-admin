import { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { Chip, ChipShape, Svg } from 'shared/components';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import {
  StyledFlexSpaceBetween,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  StyledHeadlineLarge,
  StyledLogo,
  theme,
  variables,
} from 'shared/styles';
import { Mixpanel, isManagerOrOwner } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { useTakeNowModal } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal';
import { workspaces } from 'redux/modules';
import { page } from 'resources';
import { palette } from 'shared/styles/variables/palette';
import { Roles } from 'shared/consts';
import { hasPermissionToViewData } from 'modules/Dashboard/pages/RespondentData/RespondentData.utils';
import { NavigationEyebrow } from 'shared/components/NavigationEyebrow';

import { RespondentDataHeaderProps } from './RespondentDataHeader.types';

export const RespondentDataHeader = ({
  dataTestid,
  applet,
  activity,
  subject,
}: RespondentDataHeaderProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const { featureFlags } = useFeatureFlags();
  const dataTestId = 'respondent-data-header';

  const rolesData = workspaces.useRolesData();
  const roles = appletId ? rolesData?.data?.[appletId] : undefined;

  const [isExportOpen, setIsExportOpen] = useState(false);
  const { TakeNowModal, openTakeNowModal } = useTakeNowModal({ dataTestId });
  const navigate = useNavigate();

  const navigateUp = () =>
    navigate(
      generatePath(activity ? page.appletParticipantActivities : page.appletParticipants, {
        appletId,
        subjectId: subject.id,
      }),
    );

  const handleTakeNow = () => {
    if (!activity) return;
    openTakeNowModal(activity, {
      targetSubject: {
        id: subject.id,
        userId: subject.userId,
        secretId: subject.secretUserId,
        nickname: subject.nickname,
      },
    });
  };

  const handleAssignActivity = () => {
    // TODO: Implement assign
    // https://mindlogger.atlassian.net/browse/M2-5710
    alert(`TODO: Assign activity (${activity?.id})`);
  };

  const handleOpenExport = () => {
    setIsExportOpen(true);
    Mixpanel.track('Export Data click');
  };

  const handleCloseExport = () => {
    setIsExportOpen(false);
  };

  const canDoTakeNow =
    activity &&
    featureFlags.enableMultiInformantTakeNow &&
    (isManagerOrOwner(roles?.[0]) || roles?.includes(Roles.SuperAdmin));

  const canViewData = hasPermissionToViewData(roles);

  const headerElements = {
    name: activity ? activity.name : applet.displayName,
    image: activity ? activity.image : applet.image,
  };

  return (
    <>
      <StyledFlexTopStart
        sx={{
          margin: theme.spacing(1.2, 3.2, 3.2),
        }}
      >
        <NavigationEyebrow title={t('back')} onClick={navigateUp} />
      </StyledFlexTopStart>

      <StyledFlexSpaceBetween
        sx={{
          gap: theme.spacing(1.6),
          margin: theme.spacing(0, 3.2, 0.8),
        }}
      >
        <StyledFlexTopCenter
          sx={{
            gap: theme.spacing(1.6),
          }}
        >
          {!!headerElements.image && <StyledLogo src={headerElements.image} />}
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
              <Button
                variant="tonal"
                onClick={handleAssignActivity}
                data-testid={`${dataTestid}-assign-activity`}
              >
                {t('assign')}
              </Button>
            )}
            {canDoTakeNow && (
              <Button
                variant="contained"
                onClick={handleTakeNow}
                data-testid={`${dataTestid}-take-now`}
              >
                {t('takeNow')}
              </Button>
            )}
          </StyledFlexTopCenter>
        )}
      </StyledFlexSpaceBetween>
      {canDoTakeNow && <TakeNowModal />}
    </>
  );
};
