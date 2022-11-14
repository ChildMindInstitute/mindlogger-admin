import { LeftBar } from 'components/LeftBar';
import { TopBar } from 'components/TopBar';
import { Footer } from 'layouts/Footer';

import { StyledBaseLayout } from './BaseLayout.styles';

export const BaseLayout = ({ children }: { children: JSX.Element }) => (
  <StyledBaseLayout>
    <LeftBar />
    <TopBar />
    {children}
    <Footer />
  </StyledBaseLayout>
);
