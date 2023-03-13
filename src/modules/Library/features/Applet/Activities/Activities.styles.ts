import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { StyledClearedButton } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { shouldForwardProp } from 'shared/utils/shouldForwardProp';
import { AppletUiType } from '../';

export const StyledActivitiesContainer = styled(Box, shouldForwardProp)`
  ${({ uiType }: { uiType: AppletUiType }) => {
    switch (uiType) {
      case AppletUiType.Details:
        return `
          grid-column-start: 1;
          grid-column-end: 4;
          margin-top: 4.6rem;`;
      case AppletUiType.List:
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
