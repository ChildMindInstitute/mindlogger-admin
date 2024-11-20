import { GetTableRowClassNames } from './AppletsTable.types';

export const getTableRowClassNames = ({ hasHover, isDragOver }: GetTableRowClassNames) => {
  const classNames = [
    isDragOver && 'MuiTableRow-dragged-over',
    hasHover && 'MuiTableRow-has-hover',
  ].filter(Boolean);

  return classNames.join(' ');
};
