import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { Table } from 'modules/Dashboard/components';
import { useTable } from 'shared/hooks';
import { capitalize } from 'shared/utils';
import { DateFormats } from 'shared/consts';
import { getInvitationsApi } from 'api';
import { theme } from 'shared/styles';

import { getHeadCells } from './InvitationsTable.const';
import { StyledTitle } from '../AddUser.styles';
import { InvitationsTableProps } from './InvitationsTable.types';

export const InvitationsTable = ({ invitations, setInvitations }: InvitationsTableProps) => {
  const { t } = useTranslation('app');

  const tableProps = useTable(async (params) => {
    const { data } = await getInvitationsApi(params);

    data && setInvitations(data);
  });

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
          content: () => `${process.env.APP_WEB_URI || ''}/invitation/${key}`, // TODO: Implement web environments
          value: key,
        },
        dateTimeInvited: {
          content: () => format(new Date(createdAt), DateFormats.YearMonthDayHoursMinutesSeconds),
          value: createdAt,
        },
      };
    },
  );

  const emptyComponent = !rows?.length ? t('noPendingInvitations') : undefined;

  return (
    <>
      <StyledTitle sx={{ mt: theme.spacing(4.8) }}>{t('pendingInvitations')}</StyledTitle>
      <Table
        columns={getHeadCells()}
        rows={rows}
        count={rows?.length || 0}
        emptyComponent={emptyComponent}
        {...tableProps}
      />
    </>
  );
};
