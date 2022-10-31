import { styled } from '@mui/system';

import { variables } from 'styles/variables';

export const StyledFooter = styled('div')`
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  background-color: ${variables.palette.primary50};
  padding: 1.25rem 0;
`;

export const StyledLink = styled('a')`
  color: ${variables.palette.shades0};
`;

export const StyledText = styled('span')`
  color: ${variables.palette.shades0};
  margin: 0 1.5rem;
`;
