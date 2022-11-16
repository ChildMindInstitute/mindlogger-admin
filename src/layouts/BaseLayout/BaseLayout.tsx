import { LeftBar } from 'components/LeftBar';
import { TopBar } from 'components/TopBar';
import { Footer } from 'layouts/Footer';

import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';

export const BaseLayout = ({ children }: { children: JSX.Element }) => (
  <StyledBaseLayout>
    <LeftBar />
    <StyledCol>
      <TopBar />
      {children}
      <Footer />
    </StyledCol>
  </StyledBaseLayout>
);
