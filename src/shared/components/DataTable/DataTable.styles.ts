import { styled } from '@mui/material';
import { StyledFlexColumn, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledTableContainer = styled(StyledFlexColumn, shouldForwardProp)`
  border: ${({ hasError }: { hasError?: boolean }) =>
    hasError
      ? `${variables.borderWidth.lg} solid ${variables.palette.semantic.error};`
      : `${variables.borderWidth.md} solid ${variables.palette.outline_variant};`}
  border-radius: ${variables.borderRadius.lg2};
  flex-grow: 1;
  height: 28.8rem;
  overflow-y: auto;
`;
