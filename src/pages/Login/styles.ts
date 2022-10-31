import { styled } from '@mui/system';
import Button from '@mui/material/Button';

import { variables } from 'styles/variables';

export const StyledLogin = styled('div')`
  width: 100%;
  background-color: ${variables.palette.shadesBG};
`;

export const StyledContainerWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const StyledContainer = styled('div')`
  width: 23.5rem;
  margin: 1.5rem 0;
`;

export const StyledWelcome = styled('p')`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${variables.palette.primary50};
  margin: 0;
  padding: 0 3rem;
  text-align: center;
`;

export const StyledLoginHeader = styled('p')`
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.56rem;
  margin: 0;
`;

export const StyledLoginSubheader = styled('p')`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  margin: 0.5rem 0 1.5rem;
`;

export const StyledForm = styled('form')`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${variables.palette.shades0};
  border-radius: 1.25rem;
`;

export const StyledController = styled('div')`
  margin-bottom: 2.25rem;
`;

export const StyledButton = styled(Button)`
  width: 100%;
`;

export const StyledForgotPasswordLink = styled('p')`
  width: fit-content;
  margin: 1.5rem 0;
  color: ${variables.palette.primary50};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  text-decoration: underline;
  cursor: pointer;
`;
