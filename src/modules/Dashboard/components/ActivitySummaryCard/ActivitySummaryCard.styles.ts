import { styled } from '@mui/material';

import {
  StyledFlexAllCenter,
  StyledFlexSpaceBetween,
  StyledHeadline,
  theme,
  variables,
} from 'shared/styles';

export const StyledContainer = styled(StyledFlexSpaceBetween)`
  flex-direction: column;
  padding: ${theme.spacing(2.4)};
  width: 30.6rem;
  height: 44rem;
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledImageContainer = styled(StyledFlexAllCenter)`
  min-width: 8rem;
  width: 8rem;
  height: 8rem;
  background-color: ${variables.palette.primary_container};
  border-radius: ${variables.borderRadius.md};
  overflow: hidden;
`;

export const StyledImg = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StyledActivityName = styled(StyledHeadline)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
`;
