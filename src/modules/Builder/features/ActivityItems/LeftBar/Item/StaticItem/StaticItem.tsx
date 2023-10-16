import { Skeleton } from '@mui/material';

import { StyledCol } from '../Item.styles';

export const StaticItem = () => (
  <>
    <Skeleton variant="rectangular" width={24} height={24} />
    <StyledCol sx={{ gap: '0.8rem' }}>
      <Skeleton variant="rectangular" width="100%" height={20} />
      <Skeleton variant="rectangular" width="100%" height={20} />
    </StyledCol>
  </>
);
