import { BoxProps } from '@mui/material';

export interface EmptyDashboardTableProps extends BoxProps {
  isLoading?: boolean;
  searchValue?: string;
}
