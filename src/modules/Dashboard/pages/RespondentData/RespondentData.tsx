import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { StyledBody, StyledDirectoryUpButton } from 'shared/styles/styledComponents';
import { EmptyState, LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';
import { workspaces } from 'redux/modules';
import { Roles } from 'shared/consts';

import { useRespondentDataTabs } from './RespondentData.hooks';

export const RespondentData = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { appletId } = useParams();
  useBreadcrumbs();
  const respondentDataTabs = useRespondentDataTabs();

  const navigateUp = () =>
    navigate(
      generatePath(page.appletRespondents, {
        appletId,
      }),
    );

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
      >
        {t('appletPage')}
      </StyledDirectoryUpButton>
      <LinkedTabs tabs={respondentDataTabs} />
    </StyledBody>
  );
};
