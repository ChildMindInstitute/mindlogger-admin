import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

import { DashboardTable } from 'modules/Dashboard/components';
import { useTable } from 'shared/hooks';
import { capitalize } from 'shared/utils';
import { DateFormats } from 'shared/consts';
import { getInvitationsApi } from 'api';
import { theme } from 'shared/styles';
import { DEFAULT_INVITATIONS_ROWS_PER_PAGE } from 'shared/components';

import { getHeadCells } from './InvitationsTable.const';
import { StyledTitle } from '../AddUser.styles';
import { InvitationsTableProps } from './InvitationsTable.types';

export const InvitationsTable = ({ invitations, setInvitations }: InvitationsTableProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();

  const tableProps = useTable(async (args) => {
    const params = {
      ...args,
      params: {
        ...args.params,
        appletId,
      },
    };
    const { data } = await getInvitationsApi(params);

    data && setInvitations(data);
  }, DEFAULT_INVITATIONS_ROWS_PER_PAGE);

  const rows = invitations?.result.map(
    ({ meta, firstName, lastName, role, email, key, createdAt }) => {
      const capitalizedRole = capitalize(role);

      return {
        secretUserId: {
          content: () => meta?.secret_user_id,
          value: meta?.secret_user_id,
        },
        firstName: {
          content: () => firstName,
          value: firstName,
        },
        lastName: {
          content: () => lastName,
          value: lastName,
        },
        role: {
          content: () => capitalizedRole,
          value: capitalizedRole,
        },
        email: {
          content: () => email,
          value: email,
        },
        invitationLink: {
          content: () => `${process.env.REACT_APP_WEB_URI || ''}/invitation/${key}`,
          value: key,
        },
        dateTimeInvited: {
          content: () =>
            `${format(new Date(`${createdAt}Z`), DateFormats.YearMonthDayHoursMinutesSeconds)}`,
          value: createdAt,
        },
      };
    },
  );

  const emptyComponent = rows?.length ? undefined : t('noPendingInvitations');

  return (
    <>
      <StyledTitle sx={{ mt: theme.spacing(4.8) }}>{t('pendingInvitations')}</StyledTitle>
      <DashboardTable
        columns={getHeadCells()}
        rows={rows}
        count={invitations?.count || 0}
        emptyComponent={emptyComponent}
        rowsPerPage={DEFAULT_INVITATIONS_ROWS_PER_PAGE}
        data-testid="dashboard-add-users-table"
        {...tableProps}
      />
    </>
  );
};
