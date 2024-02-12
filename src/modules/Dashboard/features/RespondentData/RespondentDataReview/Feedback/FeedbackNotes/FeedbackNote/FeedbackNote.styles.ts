import { Box, Button, styled } from '@mui/material';

import {
  StyledBodyMedium,
  StyledFlexAllCenter,
  StyledFlexTopStart,
  theme,
  variables,
} from 'shared/styles';

export const StyledNote = styled(Box)`
  width: 100%;
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledForm = styled('form')`
  margin-bottom: ${theme.spacing(1.2)};
`;

export const StyledNoteHeader = styled(StyledFlexAllCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(0.8)};

  svg {
    fill: ${variables.palette.outline};
  }
`;

export const StyledActions = styled(StyledFlexTopStart)`
  position: absolute;
  right: 2.4rem;
`;

export const StyledButton = styled(Button)`
  min-width: 1.5rem;
  padding: ${theme.spacing(1)};
  height: unset;
`;

export const StyledAuthorLabel = styled(StyledBodyMedium)`
  position: relative;
  margin-right: ${theme.spacing(1.6)};

  &::after {
    content: '.';
    position: absolute;
    right: -1rem;
    top: 30%;
    transform: translate(0, -50%);
  }
`;
