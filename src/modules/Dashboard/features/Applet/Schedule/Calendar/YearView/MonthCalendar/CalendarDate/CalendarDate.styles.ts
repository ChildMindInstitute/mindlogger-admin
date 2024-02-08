import { styled, Box, Popover } from '@mui/material';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';
import {
  StyledLabelBoldLarge,
  StyledTitleMedium,
  StyledFlexAllCenter,
  StyledClearedButton,
} from 'shared/styles/styledComponents';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledDayBtn = styled(StyledClearedButton, shouldForwardProp)`
  position: relative;
  width: 3.2rem;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
  transition: ${variables.transitions.all};
  opacity: ${({ isOffRange }: { isOffRange: boolean; isToday: boolean }) => isOffRange && variables.opacity.disabled};
  margin-bottom: ${theme.spacing(0.7)};

  & .MuiTypography-root {
    transition: ${variables.transitions.all};
  }

  ${({ isToday, isOffRange }) =>
    isToday &&
    !isOffRange &&
    `
      background-color: ${variables.palette.primary};
      border-radius: ${variables.borderRadius.xxxl};
      
      &:hover {
        & .MuiTypography-root {
          color: ${variables.palette.on_surface};
        }
      }
    
      & .MuiTypography-root {
        color: ${variables.palette.white};
      }
  `}
`;

export const StyledDotsWrapper = styled(StyledFlexAllCenter)`
  width: 100%;
  height: 0.3rem;
  position: absolute;
  bottom: -0.4rem;
  left: 0;
`;

export const StyledEventDot = styled(Box, shouldForwardProp)`
  width: 0.4rem;
  height: 0.4rem;
  flex-shrink: 0;
  margin: ${theme.spacing(0, 0.1)};
  background-color: ${({ bgColor }: { bgColor: string; isRounded: boolean }) => bgColor};
  border-radius: ${({ isRounded }) => isRounded && variables.borderRadius.half};
`;

export const StyledMonthName = styled(StyledTitleMedium)`
  text-transform: uppercase;
  color: ${variables.palette.on_surface_variant};
`;

export const StyledTooltipDate = styled(StyledFlexAllCenter)`
  width: 4.8rem;
  height: 4.8rem;
  background-color: ${variables.palette.primary};
  border-radius: ${variables.borderRadius.half};
  margin-bottom: ${theme.spacing(0.8)};

  .MuiTypography-root {
    color: ${variables.palette.white};
  }
`;

export const StyledTooltip = styled(Popover)`
  pointer-events: none;

  .MuiPaper-root {
    width: 26.1rem;
    padding: ${theme.spacing(0.8, 0.9, 1.6)};
    background-color: ${variables.palette.surface2};
    box-shadow: ${variables.boxShadow.light2};
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const StyledTooltipEventWrapper = styled(Box, shouldForwardProp)`
  width: 100%;
  background-color: ${({ bgColor }: { bgColor: string }) => bgColor !== variables.palette.white && bgColor};
  margin-bottom: ${theme.spacing(0.2)};
  padding: ${theme.spacing(0.4)};
  border-radius: ${variables.borderRadius.xs};
  display: flex;
  justify-content: flex-start;
`;

export const StyledMore = styled(StyledLabelBoldLarge)`
  width: 100%;
  text-align: left;
`;
