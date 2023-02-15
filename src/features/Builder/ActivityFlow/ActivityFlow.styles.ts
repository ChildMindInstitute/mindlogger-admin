import { styled } from '@mui/system';

import { StyledFlexAllCenter } from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledAddWrapper = styled(StyledFlexAllCenter)`
  position: relative;
  margin: ${theme.spacing(-1.1, 0)};

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

export const StyledAdd = styled(StyledFlexAllCenter)`
  width: 2.4rem;
  height: 2.4rem;
  background-color: ${variables.palette.primary};
  border-radius: ${variables.borderRadius.xs};
  cursor: pointer;

  svg {
    fill: ${variables.palette.white};
  }
`;
