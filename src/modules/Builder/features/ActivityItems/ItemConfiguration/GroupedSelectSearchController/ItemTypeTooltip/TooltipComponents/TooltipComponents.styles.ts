import { Box, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import {
  StyledBodySmall,
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopCenter,
} from 'shared/styles/styledComponents';

const {
  palette: {
    surface_variant: surfaceVariant,
    on_surface_variant: onSurfaceVariant,
    on_surface_alfa38: onSurfaceAlfa38,
    surface,
  },
  borderRadius: { xxs, xs, md },
  borderWidth: { md: borderWidthMd },
} = variables;

const commonBorderBottomStyles = `
 border-bottom: ${borderWidthMd} solid ${surfaceVariant};

  &:last-of-type {
    border-bottom: none;
  }
`;

export const StyledPresentation = styled(StyledFlexColumn)`
  justify-content: center;
  align-items: center;
  width: 20.9rem;
  height: 12rem;
  background-color: ${surface};
  border-radius: ${xs};
  margin-bottom: ${theme.spacing(1)};

  svg {
    fill: ${onSurfaceVariant};
  }
`;

export const StyledPresentationLine = styled(StyledFlexTopCenter)`
  margin-bottom: ${theme.spacing(1)};

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const StyledDateLine = styled(Box)`
  margin-left: ${theme.spacing(1)};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.8rem;
    height: ${borderWidthMd};
    width: 100%;
    border-bottom: ${borderWidthMd} solid ${surfaceVariant};
  }
`;

export const StyledNumberSelection = styled(StyledFlexColumn)`
  width: 10.9rem;
  border: ${borderWidthMd} solid ${surfaceVariant};
  border-radius: ${md};
`;

export const StyledNumberSelectionLine = styled(StyledFlexAllCenter)`
  padding: ${theme.spacing(0.25, 0)};
  min-height: 2.6rem;
  ${commonBorderBottomStyles}
`;

export const StyledMatrixLine = styled(StyledFlexTopCenter)`
  width: 12rem;
  height: 2.4rem;
  ${commonBorderBottomStyles}
`;

export const StyledMatrixLineElement = styled(StyledFlexAllCenter)`
  flex: 1 1 25%;
`;

export const StyledDashedWrapper = styled(StyledFlexAllCenter)`
  height: 9.6rem;
  width: 9.6rem;
  border-radius: ${xs};
  border: ${borderWidthMd} dashed ${surfaceVariant};
`;

export const StyledEnterText = styled(StyledBodySmall)`
  max-width: 80%;
  text-align: center;
  position: relative;
  color: ${onSurfaceAlfa38};

  &:before {
    content: '';
    position: absolute;
    left: -0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: ${borderWidthMd};
    height: 2.8rem;
    border-left: ${borderWidthMd} solid ${onSurfaceVariant};
    border-radius: ${xxs};
  }
`;

export const StyledTooltipText = styled(StyledBodySmall)`
  color: ${onSurfaceVariant};
`;
