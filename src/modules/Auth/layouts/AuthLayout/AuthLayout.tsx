import { Outlet } from 'react-router-dom';

import { auth } from 'modules/Auth/state';
import { Spinner, Svg, Footer, Banners } from 'shared/components';

import {
  StyledAuthLayout,
  StyledAuthWrapper,
  StyledAuthWrapperInner,
  StyledHeader,
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
          <Svg id="header-logo" width={250} height={44} />
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
