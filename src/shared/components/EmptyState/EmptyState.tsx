import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledHeadline } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { EmptyStateProps } from './EmptyState.types';
import { StyledEmptyState } from './EmptyState.styles';

export const EmptyState = ({
  children,
  icon = 'not-found',
  width = '38.1rem',
}: EmptyStateProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledEmptyState className="empty-state-container" sx={{ width }}>
      <Svg width="80" height="80" id={icon} fill={variables.palette.outline} />

      <StyledHeadline color={variables.palette.outline}>{children || t('noData')}</StyledHeadline>
    </StyledEmptyState>
  );
};
