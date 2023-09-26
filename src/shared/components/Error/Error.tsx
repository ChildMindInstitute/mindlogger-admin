import { getErrorMessage } from 'shared/utils/errors';
import { StyledBodyLarge, theme, variables } from 'shared/styles';

import { ErrorProps } from './Error.types';

export const Error = ({ error, sxProps }: ErrorProps) => (
  <StyledBodyLarge
    color={variables.palette.semantic.error}
    sx={sxProps || { m: theme.spacing(1, 2.6) }}
  >
    {getErrorMessage(error)}
  </StyledBodyLarge>
);
