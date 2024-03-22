import { GetTableRowClassNames } from './AppletsTable.types';

export const getTableRowClassNames = ({ hasHover, isDragOver }: GetTableRowClassNames) => {
  const classNames = [isDragOver && 'dragged-over', hasHover && 'has-hover'].filter(Boolean);

  return classNames.join(' ');
};
