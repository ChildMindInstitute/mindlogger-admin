import { useTranslation } from 'react-i18next';

import { Row, Table } from 'shared/components';

import { getHeadCells } from './InvitationsTable.const';
import { StyledTitle } from '../AddUser.styles';

export const InvitationsTable = ({ rows }: { rows: Row[] }) => {
  const { t } = useTranslation('app');

  const emptyComponent = t('noPendingInvitations');

  return (
    <>
      <StyledTitle>{t('pendingInvitations')}</StyledTitle>
      <Table
        columns={getHeadCells()}
        rows={rows}
        orderBy="dateTimeInvited"
        emptyComponent={emptyComponent}
      />
    </>
  );
};
