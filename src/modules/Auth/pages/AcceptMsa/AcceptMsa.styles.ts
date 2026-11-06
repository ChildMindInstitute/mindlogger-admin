import { Box, styled } from '@mui/material';

import { StyledFlexAllCenter, theme, variables } from 'shared/styles';

// Plain page behind the dialogue, without the auth header and footer
export const StyledAcceptMsaPage = styled(StyledFlexAllCenter)`
  flex-direction: column;
  min-height: 100vh;
  padding: ${theme.spacing(2.4)};
  background-color: ${variables.palette.neutral95};
`;

export const StyledMsaCard = styled(Box)`
  width: 66rem;
  max-width: 100%;
  background-color: ${variables.modalBackground};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledSignedInAs = styled(Box)`
  margin-top: ${theme.spacing(1.2)};
`;
