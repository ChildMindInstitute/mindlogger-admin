import { Outlet } from 'react-router-dom';

import curiousLogo from 'assets/images/curious_logo--white.png';
import { auth } from 'modules/Auth/state';
import { Footer, Spinner } from 'shared/components';
import { Banners } from 'shared/components/Banners';

import {
  StyledAuthLayout,
  StyledAuthWrapper,
  StyledAuthWrapperInner,
  StyledHeader,
  StyledLogo,
  StyledLogoWrapper,
  StyledOutlet,
} from './AuthLayout.styles';

export const AuthLayout = () => {
  const status = auth.useStatus();

  return (
    <StyledAuthLayout>
      {status === 'loading' && <Spinner />}
      <StyledHeader>
        <StyledLogoWrapper>
          <StyledLogo src={curiousLogo} alt="Curious Logo" />
        </StyledLogoWrapper>
        <Banners />
      </StyledHeader>
      <StyledOutlet>
        <StyledAuthWrapper>
          <StyledAuthWrapperInner>
            <Outlet />
          </StyledAuthWrapperInner>
        </StyledAuthWrapper>
      </StyledOutlet>
      <Footer />
    </StyledAuthLayout>
  );
};
