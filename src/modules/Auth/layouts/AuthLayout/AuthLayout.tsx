import { Outlet } from 'react-router-dom';

import { auth } from 'modules/Auth/state';
import { Footer, Spinner, Svg } from 'shared/components';
import { Banners } from 'shared/components/Banners';
import { RebrandBanner } from 'shared/components/Banners/RebrandBanner';

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
      <RebrandBanner />
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
