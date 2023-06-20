import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAsync, useBreadcrumbs } from 'shared/hooks';
import { getInvitationsApi } from 'api';
import { StyledHeadlineLarge, theme } from 'shared/styles';
import { DEFAULT_INVITATIONS_ROWS_PER_PAGE, EmptyState } from 'shared/components';
import { workspaces } from 'redux/modules';
import { Roles } from 'shared/consts';

import { AddUserForm } from './AddUserForm';
import { InvitationsTable } from './InvitationsTable';
import { LinkGenerator } from './LinkGenerator';
import { Invitations } from './AddUser.types';

export const AddUser = () => {
  const { appletId } = useParams();
  const { t } = useTranslation('app');

  const [invitations, setInvitations] = useState<Invitations | null>(null);

  const rolesData = workspaces.useRolesData();
  const appletRoles = appletId ? rolesData?.data?.[appletId] : undefined;

  const { execute } = useAsync(getInvitationsApi, (res) => res?.data && setInvitations(res.data));
  useBreadcrumbs([
    {
      icon: 'users-outlined',
      label: t('addUser'),
    },
  ]);

  const getInvitationsHandler = () => {
    execute({
      params: { limit: DEFAULT_INVITATIONS_ROWS_PER_PAGE, appletId },
    });
  };

  useEffect(() => {
    getInvitationsHandler();
  }, []);

  if (appletRoles?.[0] === Roles.Reviewer)
    return <EmptyState width="25rem">{t('noPermissions')}</EmptyState>;

  return (
    <>
      <StyledHeadlineLarge sx={{ mb: theme.spacing(4.8) }}>{t('addUsers')}</StyledHeadlineLarge>
      <AddUserForm getInvitationsHandler={getInvitationsHandler} roles={appletRoles} />
      <InvitationsTable invitations={invitations} setInvitations={setInvitations} />
      <LinkGenerator />
    </>
  );
};
