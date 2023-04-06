import { styled } from '@mui/system';

import { Svg } from 'shared/components';
import { StyledFlexColumn, StyledTitleMedium, theme, variables } from 'shared/styles';

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
