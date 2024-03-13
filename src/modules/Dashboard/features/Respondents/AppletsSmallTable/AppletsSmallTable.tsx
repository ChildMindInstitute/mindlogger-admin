import { UiType } from 'shared/components/Table';
import { variables } from 'shared/styles/variables';

import { getHeadCells } from './AppletsSmallTable.const';
import { AppletsSmallTableProps } from './AppletsSmallTable.types';
import { StyledTable } from './AppletsSmallTable.styles';

export const AppletsSmallTable = ({
  tableRows,
  'data-testid': dataTestid,
}: AppletsSmallTableProps) => (
  <StyledTable
    columns={getHeadCells()}
    rows={tableRows}
    orderBy="appletName"
    uiType={UiType.Secondary}
    data-testid={dataTestid}
    tableHeadBg={variables.modalBackground}
  />
);
