import { Box, Button, styled } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledFlexTopStart, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledItem = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(1.2, 2.4)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(1.6)};
  cursor: pointer;

  ${({ isSelected }: { isSelected: boolean }) =>
    isSelected &&
    `
    background-color: ${variables.palette.surface2};
    p {
      font-weight: ${variables.font.weight.bold};
    }
  `}
`;

export const StyledButton = styled(Button)`
  margin-left: ${theme.spacing(1.6)};
`;

export const StyledHeader = styled(StyledFlexTopStart)`
  align-items: center;
  justify-content: space-between;
`;

export const StyledSvg = styled(Svg)`
  margin-left: ${theme.spacing(2.4)};
  border-radius: ${variables.borderRadius.half};

  :hover {
    background-color: ${variables.palette.on_surface_alpha8};
  }
`;
