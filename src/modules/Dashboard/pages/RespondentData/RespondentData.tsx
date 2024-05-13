import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { EmptyState, Svg } from 'shared/components';
import { workspaces } from 'shared/state';
import { StyledBody, StyledDirectoryUpButton } from 'shared/styles';
import { page } from 'resources';
import { Mixpanel } from 'shared/utils';
import { RespondentData as RespondentDataFeature } from 'modules/Dashboard/features/RespondentData';
import { hasPermissionToViewData } from 'modules/Dashboard/features/ParticipantActivity/ParticipantActivity.utils';

export const RespondentData = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { appletId } = useParams();

  const navigateUp = () =>
    navigate(
      generatePath(page.appletRespondents, {
        appletId,
      }),
    );

  useEffect(() => {
    Mixpanel.trackPageView('Data Viz');
  }, []);

  const rolesData = workspaces.useRolesData();
  const appletRoles = appletId ? rolesData?.data?.[appletId] : undefined;

  if (!hasPermissionToViewData(appletRoles))
    return <EmptyState width="25rem">{t('noPermissions')}</EmptyState>;

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={navigateUp}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
        data-testid="respondents-summary-back-to-applet"
      >
        {t('back')}
      </StyledDirectoryUpButton>
      <RespondentDataFeature />
    </StyledBody>
  );
};

export default RespondentData;
