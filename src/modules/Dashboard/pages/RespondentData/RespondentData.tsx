import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { StyledBody, StyledDirectoryUpButton } from 'shared/styles/styledComponents';
import { EmptyState, Svg } from 'shared/components';
import { Roles } from 'shared/consts';
import { Mixpanel } from 'shared/utils/mixpanel';
import { page } from 'resources';
import { workspaces } from 'redux/modules';
import { RespondentData as RespondentDataFeature } from 'modules/Dashboard/features/RespondentData';

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

  if (appletRoles?.[0] === Roles.Coordinator)
    return <EmptyState width="25rem">{t('noPermissions')}</EmptyState>;

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={navigateUp}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
        data-testid="respondents-summary-back-to-applet"
      >
        {t('respondents')}
      </StyledDirectoryUpButton>
      <RespondentDataFeature />
    </StyledBody>
  );
};
