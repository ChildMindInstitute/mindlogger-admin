import { Outlet } from 'react-router-dom';

import AuthHeader from 'components/AuthHeader';
import Footer from 'components/Footer';
import { StyledAuthLayout, StyledOutlet } from './styles';

const AuthLayout = () => (
  <StyledAuthLayout>
    <AuthHeader />
    <StyledOutlet>
      <Outlet />
    </StyledOutlet>
    <Footer />
  </StyledAuthLayout>
);

export default AuthLayout;
