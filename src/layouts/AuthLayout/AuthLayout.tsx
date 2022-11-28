import { Outlet } from 'react-router-dom';

import { Svg } from 'components/Svg';
import { Footer } from 'layouts/Footer';
import { auth } from 'redux/modules';
import { Spinner } from 'components/Spinner';

import {
  StyledAuthLayout,
  StyledAuthWrapper,
  StyledAuthWrapperInner,
  StyledHeader,
  StyledOutlet,
} from './AuthLayout.styles';

export const AuthLayout = (): JSX.Element => {
  const status = auth.useStatus();

  return (
    <StyledAuthLayout>
      {status === 'loading' && <Spinner />}
      <StyledHeader>
        <Svg id="header-logo" width={224} height={44} />
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
