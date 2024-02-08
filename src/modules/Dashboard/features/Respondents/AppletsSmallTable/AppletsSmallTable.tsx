import { Table, UiType } from 'shared/components';

import { getHeadCells } from './AppletsSmallTable.const';
import { AppletsSmallTableProps } from './AppletsSmallTable.types';

export const AppletsSmallTable = ({ tableRows, 'data-testid': dataTestid }: AppletsSmallTableProps) => (
  <Table
    columns={getHeadCells()}
    rows={tableRows}
    orderBy="appletName"
    uiType={UiType.Secondary}
    data-testid={dataTestid}
  />
);
