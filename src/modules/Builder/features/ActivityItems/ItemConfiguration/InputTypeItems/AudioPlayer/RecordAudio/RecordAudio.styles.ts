import { styled } from '@mui/material';

import { StyledFlexColumn, StyledFlexTopStart } from 'shared/styles';

export const StyledButtons = styled(StyledFlexTopStart)`
  gap: 1.6rem;
  justify-content: center;
`;

export const StyledRecordButton = styled(StyledFlexColumn)`
  height: 8rem;
  align-items: center;
  justify-content: space-between;
`;
