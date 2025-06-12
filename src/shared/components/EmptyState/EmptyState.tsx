import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledHeadlineSmall } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { StyledEmptyState } from './EmptyState.styles';
import { EmptyStateProps } from './EmptyState.types';

export const EmptyState = ({
  children,
  icon = 'not-found',
  width = '38.1rem',
}: EmptyStateProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledEmptyState className="empty-state-container" sx={{ width }}>
      <Svg width="80" height="80" id={icon} fill={variables.palette.outline} />

      <StyledHeadlineSmall color={variables.palette.outline}>
        {children || t('noData')}
      </StyledHeadlineSmall>
    </StyledEmptyState>
  );
};
