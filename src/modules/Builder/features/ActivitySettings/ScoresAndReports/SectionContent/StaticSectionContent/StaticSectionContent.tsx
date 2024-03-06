import { Skeleton } from '@mui/material';

import { theme } from 'shared/styles';

export const StaticSectionContent = () => (
  <>
    <Skeleton variant="rounded" height={60} />
    <Skeleton variant="text" height={60} width={180} sx={{ mt: theme.spacing(1.2) }} />
    <Skeleton variant="text" height={60} width={180} sx={{ mt: theme.spacing(1.2) }} />
    <Skeleton variant="rounded" height={300} />
    <Skeleton variant="text" height={60} width={180} sx={{ mt: theme.spacing(2.4) }} />
  </>
);
