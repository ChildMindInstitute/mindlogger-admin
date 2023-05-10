import { styled } from '@mui/material';

import { StyledFlexColumn, StyledFlexTopStart, theme } from 'shared/styles';

export const StyledButtons = styled(StyledFlexTopStart)`
  gap: 1.6rem;
  justify-content: center;
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledRecordButton = styled(StyledFlexColumn)`
  align-items: center;
`;
