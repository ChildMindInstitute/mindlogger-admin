import { Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { Svg } from 'components/Svg';
import { Footer } from 'layouts/Footer';
import { auth } from 'redux/modules';

import { StyledAuthLayout, StyledHeader, StyledOutlet, StyledSpinner } from './AuthLayout.styles';

export const AuthLayout = () => {
  const status = auth.useStatus();

  return (
    <StyledAuthLayout>
      {status === 'loading' && (
        <StyledSpinner>
          <CircularProgress size={60} />
        </StyledSpinner>
      )}
      <StyledHeader>
        <Svg id="header-logo" width={224} height={44} />
      </StyledHeader>
      <StyledOutlet>
        <Outlet />
      </StyledOutlet>
      <Footer />
    </StyledAuthLayout>
  );
};
