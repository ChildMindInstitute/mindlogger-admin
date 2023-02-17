import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import { StyledTitleLarge } from 'styles/styledComponents';
import { variables } from 'styles/variables';

import { EmptyTableProps } from './EmptyTable.types';
import { StyledEmptyTable, StyledIcon } from './EmptyTable.styles';

export const EmptyTable = ({ children, icon = 'not-found' }: EmptyTableProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledEmptyTable>
      <StyledIcon>
        <Svg width="80" height="80" id={icon} />
      </StyledIcon>
      <StyledTitleLarge color={variables.palette.secondary60}>
        {children || t('noData')}
      </StyledTitleLarge>
    </StyledEmptyTable>
  );
};
