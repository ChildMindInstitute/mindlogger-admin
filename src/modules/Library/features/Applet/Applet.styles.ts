import styled from '@emotion/styled/macro';
import { Box, Button } from '@mui/material';

import {
  theme,
  variables,
  StyledFlexWrap,
  StyledClearedButton,
  StyledFlexAllCenter,
} from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { AppletUiType } from './Applet.types';

export const StyledAppletContainer = styled(Box, shouldForwardProp)`
  display: grid;
  grid-template-columns: 10.4rem 1fr auto;
  column-gap: 2.4rem;

  ${({ uiType }: { uiType: AppletUiType }) => {
    switch (uiType) {
      case AppletUiType.Details:
        return `
        grid-template-areas:
        'appletImage . . '
        'activities activities activities';`;
      case AppletUiType.List:
      case AppletUiType.Cart:
        return `
        grid-template-areas:
        'appletImage . . '
        'appletImage activities activities';`;
    }
  }}
`;

export const StyledAppletName = styled(Box)`
  display: flex;

  .MuiTypography-root {
    color: ${variables.palette.on_surface};
  }
`;

export const StyledAppletKeywordsContainer = styled(StyledFlexWrap)`
  margin-top: ${theme.spacing(1.6)};
`;

export const StyledAppletKeyword = styled(Button, shouldForwardProp)`
  background-color: ${variables.palette.on_surface_alfa8};
  color: ${variables.palette.on_surface_variant};
  padding: ${theme.spacing(0.2, 1)};
  height: auto;
  margin-bottom: ${theme.spacing(0.8)};
  transition: ${variables.transitions.opacity};
  word-break: break-word;
  cursor: ${({ hasSearch }: { hasSearch: boolean }) => (hasSearch ? 'pointer' : 'default')};

  && {
    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.palette.on_surface_alfa8};
      opacity: ${({ hasSearch }) => (hasSearch ? '0.85' : '1')};
    }
  }

  &:not(:last-child) {
    margin-right: ${theme.spacing(1.2)};
  }
`;

export const StyledButtonsContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

export const StyledActivitiesContainer = styled(Box)`
  grid-area: activities;
  margin-top: ${theme.spacing(0.8)};
`;

export const StyledSvgContainer = styled(StyledFlexAllCenter)`
  width: 4rem;
  height: 4rem;
  border-radius: ${variables.borderRadius.half};
  transition: ${variables.transitions.bgColor};

  svg {
    fill: ${variables.palette.outline};
  }
`;

export const StyledExpandedButton = styled(StyledClearedButton)`
  .MuiTypography-root {
    color: ${variables.palette.outline};
  }

  &:hover {
    ${StyledSvgContainer} {
      background-color: ${variables.palette.on_surface_alfa8};
    }

    &.MuiButton-text {
      background-color: transparent;
    }
  }
`;

export const StyledActivities = styled(Box)`
  margin-top: ${theme.spacing(1.6)};
`;
