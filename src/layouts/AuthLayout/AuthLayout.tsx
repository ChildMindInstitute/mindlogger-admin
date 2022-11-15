import { Outlet } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { Footer } from 'layouts/Footer';

import { StyledAuthLayout, StyledHeader, StyledOutlet } from './AuthLayout.styles';

export const AuthLayout = () => (
  <StyledAuthLayout>
    <StyledHeader>
      <Svg id="header-logo" width={224} height={44} />
    </StyledHeader>
    <StyledOutlet>
      <Outlet />
    </StyledOutlet>
    <Footer />
  </StyledAuthLayout>
);
