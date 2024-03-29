import { styled } from '@mui/material';

import { StyledFlexAllCenter, StyledClearedButton, theme, variables } from 'shared/styles';

export const StyledInsertWrapper = styled(StyledFlexAllCenter)`
  position: relative;
  bottom: 0.8rem;
  margin: ${theme.spacing(-1.1, 0)};
  opacity: 0;

  &:hover {
    opacity: 1;
  }

  span {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 0.1rem;
    width: 100%;
    background-color: ${variables.palette.primary};
    z-index: -1;
  }
`;

export const StyledInsert = styled(StyledClearedButton)`
  width: 2.4rem;
  height: 2.4rem;
  background-color: ${variables.palette.primary};
  border-radius: ${variables.borderRadius.half};

  && {
    &:hover {
      background-color: ${variables.palette.primary};
    }
  }

  svg {
    fill: ${variables.palette.white};
  }
`;
