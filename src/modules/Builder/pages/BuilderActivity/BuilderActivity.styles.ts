import { Box, styled } from '@mui/material';

import { StyledBody, StyledFlexAllCenter, theme, variables } from 'shared/styles';

export const StyledBuilderActivityBody = styled(StyledBody)`
  .MuiBadge-root {
    position: absolute;
    top: 1em;
    right: 1em;
  }
`;

export const StyledWrapper = styled(Box)`
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
`;

export const StyledConfig = styled(StyledFlexAllCenter)`
  flex-direction: column;
  padding: ${theme.spacing(0.85)};
  position: relative;
  width: 90rem;
  max-width: calc(100% - 40rem);
  margin: 0 auto;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.3rem;
    width: 100%;
    border-radius: 10rem 10rem 0 0;
    background-color: ${variables.palette.primary};
  }

  svg {
    fill: ${variables.palette.primary};
  }
`;
