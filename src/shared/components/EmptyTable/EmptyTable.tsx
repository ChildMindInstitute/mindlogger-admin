import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledTitleLarge } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { EmptyTableProps } from './EmptyTable.types';
import { StyledEmptyTable, StyledIcon } from './EmptyTable.styles';

export const EmptyTable = ({
  children,
  icon = 'not-found',
  width = '38.1rem',
}: EmptyTableProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledEmptyTable sx={{ width }}>
      <StyledIcon>
        <Svg width="80" height="80" id={icon} />
      </StyledIcon>
      <StyledTitleLarge color={variables.palette.secondary60}>
        {children || t('noData')}
      </StyledTitleLarge>
    </StyledEmptyTable>
  );
};
