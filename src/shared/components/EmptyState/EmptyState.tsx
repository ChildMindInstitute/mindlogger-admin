import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledTitleLarge } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { StyledEmptyState, StyledIcon } from './EmptyState.styles';
import { EmptyStateProps } from './EmptyState.types';

export const EmptyState = ({ children, icon = 'not-found', width = '38.1rem' }: EmptyStateProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledEmptyState className="empty-state-container" sx={{ width }}>
      <StyledIcon>
        <Svg width="80" height="80" id={icon} />
      </StyledIcon>
      <StyledTitleLarge color={variables.palette.secondary60}>{children || t('noData')}</StyledTitleLarge>
    </StyledEmptyState>
  );
};
