import { styled } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledActivityThumbnailContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8rem;
  height: 8rem;
  background-color: ${variables.palette.primary_container};
  border-radius: ${variables.borderRadius.md};
  overflow: hidden;
`;

export const StyledActivityThumbnailImg = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
