import { Row, Table, UiType } from 'components/Tables';

import { getHeadCells } from './AppletsSmallTable.const';

export const AppletsSmallTable = ({ tableRows }: { tableRows: Row[] | undefined }) => (
  <Table columns={getHeadCells()} rows={tableRows} orderBy="appletName" uiType={UiType.secondary} />
);
