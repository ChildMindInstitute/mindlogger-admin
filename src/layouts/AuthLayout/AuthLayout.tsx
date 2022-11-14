import { Outlet } from 'react-router-dom';

import { Footer } from 'layouts/Footer';

import { AuthHeader } from './AuthHeader';
import { StyledAuthLayout, StyledOutlet } from './AuthLayout.styles';

export const AuthLayout = () => (
  <StyledAuthLayout>
    <AuthHeader />
    <StyledOutlet>
      <Outlet />
    </StyledOutlet>
    <Footer />
  </StyledAuthLayout>
);
