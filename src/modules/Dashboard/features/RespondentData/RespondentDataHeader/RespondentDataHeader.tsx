import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { Chip, ChipShape, Svg } from 'shared/components';
import { ExportDataSetting } from 'shared/features/AppletSettings';
import {
  StyledBodyLarge,
  StyledFlexSpaceBetween,
  StyledFlexTopCenter,
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

import { ActionButton, StyledButton } from '../RespondentData.styles';
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
      generatePath(page.appletParticipants, {
        appletId,
      }),
    );

  const handleTakeNow = () => {
    if (!activity) return;
    openTakeNowModal(activity, {
      subject: {
        id: subject.id,
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
    featureFlags.enableMultiInformantTakeNow &&
    (isManagerOrOwner(roles?.[0]) || roles?.includes(Roles.SuperAdmin));

  const canViewData = hasPermissionToViewData(roles);

  const headerElements = {
    name: activity ? activity.name : applet.displayName,
    image: activity ? activity.image : applet.image,
  };

  return (
    <>
      <Box
        sx={{
          gap: theme.spacing(0.8),
          margin: theme.spacing(1.2, 3.2, 3.2),
        }}
      >
        <StyledButton onClick={navigateUp}>
          <Svg id="arrow-navigate-left" width="2.4rem" height="2.4rem" />
          <StyledBodyLarge sx={{ px: 1, color: palette.on_surface_variant }}>
            {t('back')}
          </StyledBodyLarge>
        </StyledButton>
      </Box>

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
              data-testid="header-option-export-button"
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
              <ActionButton
                onClick={handleAssignActivity}
                data-testid={`${dataTestid}-assign-activity`}
                sx={{ backgroundColor: variables.palette.secondary_container }}
              >
                {t('assign')}
              </ActionButton>
            )}
            {activity && canDoTakeNow && (
              <ActionButton
                variant="contained"
                onClick={handleTakeNow}
                data-testid={`${dataTestid}-take-now`}
                sx={{
                  backgroundColor: variables.palette.primary,
                  color: variables.palette.white,
                }}
              >
                {t('takeNow')}
              </ActionButton>
            )}
          </StyledFlexTopCenter>
        )}
      </StyledFlexSpaceBetween>
      <TakeNowModal />
    </>
  );
};
