import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';

import { EmptyTableProps } from './EmptyTable.types';
import { StyledEmptyTable, StyledIcon } from './EmptyTable.styles';

export const EmptyTable = ({ children, icon = 'confused' }: EmptyTableProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledEmptyTable>
      <StyledIcon>
        <Svg id={icon} width="80" height="80" />
      </StyledIcon>
      {children || t('noData')}
    </StyledEmptyTable>
  );
};
