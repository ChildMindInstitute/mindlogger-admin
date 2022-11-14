import { Outlet } from 'react-router-dom';

import { Icon } from 'components/Icon';
import { Footer } from 'components/Footer';

import { StyledAuthLayout, StyledHeader, StyledOutlet } from './AuthLayout.styles';

export const AuthLayout = () => (
  <StyledAuthLayout>
    <StyledHeader>
      <Icon.HeaderLogo />
    </StyledHeader>
    <StyledOutlet>
      <Outlet />
    </StyledOutlet>
    <Footer />
  </StyledAuthLayout>
);
