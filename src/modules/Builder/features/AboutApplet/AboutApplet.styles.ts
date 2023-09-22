import { styled, Box } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledFlexColumn, StyledTitleMedium, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledContainer = styled(StyledFlexColumn)`
  width: 55rem;
`;

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.outline};
`;

export const StyledTitle = styled(StyledTitleMedium)`
  display: flex;
  margin-bottom: ${theme.spacing(1.6)};

  svg {
    height: 2.4rem;
    margin-left: ${theme.spacing(0.4)};
  }
`;

export const StyledCircle = styled(Box, shouldForwardProp)`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: ${variables.borderRadius.half};
  background-color: ${({ bgColor }: { bgColor: string }) => bgColor};
`;
