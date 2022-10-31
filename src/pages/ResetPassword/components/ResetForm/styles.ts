import { styled } from '@mui/system';
import Button from '@mui/material/Button';

import { variables } from 'styles/variables';

export const StyledForm = styled('form')`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${variables.palette.shades0};
  border-radius: 1.25rem;
`;

export const StyledResetPasswordHeader = styled('p')`
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.56rem;
  margin: 0;
`;

export const StyledResetPasswordSubheader = styled('p')`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  margin: 0.5rem 0 1.5rem;
`;

export const StyledController = styled('div')`
  margin-bottom: 2.625rem;
`;

export const StyledButton = styled(Button)`
  width: 100%;
`;

export const StyledBack = styled('p')`
  color: ${variables.palette.primary50};
  text-align: center;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  text-decoration: underline;
  cursor: pointer;
  margin: 1.5rem 0 0;
`;
