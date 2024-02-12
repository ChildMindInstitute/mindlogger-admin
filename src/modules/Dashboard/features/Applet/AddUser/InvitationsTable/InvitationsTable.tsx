import { useState, UIEvent } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DashboardTable } from 'modules/Dashboard/components';
import { useTable } from 'shared/hooks';
import { getInvitationsApi } from 'api';
import { theme } from 'shared/styles';
import { DEFAULT_INVITATIONS_ROWS_PER_PAGE } from 'shared/components';

import { StyledTitle } from '../AddUser.styles';
import { getHeadCells, getInvitationsTableRows } from './InvitationsTable.utils';
import { InvitationsTableProps } from './InvitationsTable.types';
import { dataTestId, SCROLL_THRESHOLD } from './InvitationsTable.const';

export const InvitationsTable = ({ invitations, setInvitations }: InvitationsTableProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const [openTooltipIndex, setOpenTooltipIndex] = useState(-1);

  const handleTooltipClose = () => {
    setOpenTooltipIndex(-1);
  };

  const handleTableScroll = (event: UIEvent<HTMLDivElement>) => {
    const scrollPosition = event.currentTarget.scrollTop;

    if (scrollPosition > SCROLL_THRESHOLD) {
      setOpenTooltipIndex(-1);
    }
  };

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

  const rows = getInvitationsTableRows({
    invitations,
    setOpenTooltipIndex,
    openTooltipIndex,
    handleTooltipClose,
  });

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
        maxHeight={'34.2rem'}
        onScroll={handleTableScroll}
        data-testid={dataTestId}
        {...tableProps}
      />
    </>
  );
};
