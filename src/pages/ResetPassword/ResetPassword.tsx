import { useState } from 'react';

import { Confirmation } from './components/Confirmation';
import { ResetForm } from './components/ResetForm';

import {
  StyledResetPassword,
  StyledContainerWrapper,
  StyledContainer,
} from './ResetPassword.styles';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');

  return (
    <StyledResetPassword>
      <StyledContainerWrapper>
        <StyledContainer>
          {email ? <Confirmation email={email} /> : <ResetForm setEmail={setEmail} />}
        </StyledContainer>
      </StyledContainerWrapper>
    </StyledResetPassword>
  );
};
