import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';
import {
  StyledFlexWrap,
  StyledLabelBoldMedium,
  StyledClearedButton,
} from 'shared/styles/styledComponents';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { AppletUiType } from './Applet.types';

export const StyledAppletContainer = styled(Box)`
  display: grid;
  grid-template-columns: 10.4rem 1fr auto;
  column-gap: 2.4rem;
`;

export const StyledAppletName = styled(Box)`
  display: flex;
`;

export const StyledAppletKeywordsContainer = styled(StyledFlexWrap)`
  margin-top: ${theme.spacing(1.6)};
`;

export const StyledAppletKeyword = styled(StyledLabelBoldMedium)`
  color: ${variables.palette.on_surface_variant};
  background-color: ${variables.palette.on_surface_alfa8};
  padding: ${theme.spacing(0.2, 1)};
  border-radius: ${variables.borderRadius.xxxl2};
  margin-bottom: ${theme.spacing(0.8)};

  &:not(:last-child) {
    margin-right: ${theme.spacing(1.2)};
  }
`;

export const StyledButtonsContainer = styled(Box)`
  display: flex;
  justify-content: space-between;

  .MuiButton-contained {
    &:disabled .MuiButton-startIcon {
      svg {
        fill: ${variables.palette.contained_btn_disabled_text};
      }
    }

    .MuiButton-startIcon {
      svg {
        fill: ${variables.palette.white};
      }
    }
  }

  .MuiButton-outlined {
    &:disabled .MuiButton-startIcon {
      svg {
        fill: ${variables.palette.contained_btn_disabled_text};
      }
    }

    .MuiButton-startIcon {
      svg {
        fill: ${variables.palette.primary};
      }
    }
  }
`;

////////

export const StyledActivitiesContainer = styled(Box, shouldForwardProp)`
  ${({ uiType }: { uiType: AppletUiType }) => {
    switch (uiType) {
      case AppletUiType.Details:
        return `
          grid-column-start: 1;
          grid-column-end: 4;
          margin-top: 4.6rem;`;
      case AppletUiType.List:
      case AppletUiType.Cart:
        return `
          grid-column-start: 2;
          grid-column-end: 4;`;
    }
  }}
`;

export const StyledExpandedButton = styled(StyledClearedButton)`
  &.MuiButton-text:hover {
    background-color: transparent;
  }

  .MuiTypography-root {
    color: ${variables.palette.outline};
  }

  svg {
    fill: ${variables.palette.outline};
  }
`;

export const StyledActivities = styled(Box)`
  margin-top: ${theme.spacing(1.6)};
`;
