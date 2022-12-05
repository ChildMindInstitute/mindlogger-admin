import { useTranslation } from 'react-i18next';

import { Row, Table } from 'components/Table';

import { getHeadCells } from './InvitationsTable.const';
import { StyledTitle } from './Invitationstable.styles';

export const InvitationsTable = ({ rows }: { rows: Row[] }) => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledTitle>{t('pendingInvitations')}</StyledTitle>
      <Table columns={getHeadCells(t)} rows={rows} orderBy={'dateTimeInvited'} />
    </>
  );
};
