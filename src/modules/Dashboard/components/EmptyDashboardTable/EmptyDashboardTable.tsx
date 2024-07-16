import { useTranslation } from 'react-i18next';

import { StyledFlexColumn, theme } from 'shared/styles';

import { EmptyDashboardTableProps } from './EmptyDashboardTable.types';

export const EmptyDashboardTable = ({
  isLoading = false,
  searchValue = '',
  ...otherProps
}: EmptyDashboardTableProps) => {
  const { t } = useTranslation('app');

  if (isLoading) {
    return null;
  }

  if (searchValue) {
    return <>{t('noMatchWasFound', { searchValue })}</>;
  }

  return (
    <StyledFlexColumn
      data-testid="empty-dashboard-table"
      component="span"
      sx={{ gap: theme.spacing(2.4), placeItems: 'center' }}
      {...otherProps}
    />
  );
};
