import { styled } from '@mui/system';

import { theme, variables, StyledClearedButton, StyledFlexAllCenter } from 'shared/styles';

export const StyledAddWrapper = styled(StyledFlexAllCenter)`
  position: relative;
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

export const StyledAdd = styled(StyledClearedButton)`
  width: 2.4rem;
  height: 2.4rem;
  background-color: ${variables.palette.primary};
  border-radius: ${variables.borderRadius.xs};

  && {
    &:hover {
      background-color: ${variables.palette.primary};
    }
  }

  svg {
    fill: ${variables.palette.white};
  }
`;
