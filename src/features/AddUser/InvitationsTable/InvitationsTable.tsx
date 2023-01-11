import { useTranslation } from 'react-i18next';

import { Row, Table } from 'components/Tables';

import { getHeadCells } from './InvitationsTable.const';
import { StyledTitle } from '../AddUser.styles';

export const InvitationsTable = ({ rows }: { rows: Row[] }) => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledTitle>{t('pendingInvitations')}</StyledTitle>
      <Table columns={getHeadCells()} rows={rows} orderBy="dateTimeInvited" />
    </>
  );
};
