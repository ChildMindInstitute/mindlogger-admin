import { Skeleton } from '@mui/material';

import { StyledCol, StyledItem } from '../Item/Item.styles';
import { StaticItemProps } from './StaticItem.types';

export const StaticItem = ({ dragHandleProps }: StaticItemProps) => (
  <StyledItem {...dragHandleProps}>
    <Skeleton variant="rectangular" width={24} height={24} />
    <StyledCol sx={{ gap: '0.8rem' }}>
      <Skeleton variant="rectangular" width="100%" height={20} />
      <Skeleton variant="rectangular" width="100%" height={20} />
    </StyledCol>
  </StyledItem>
);
