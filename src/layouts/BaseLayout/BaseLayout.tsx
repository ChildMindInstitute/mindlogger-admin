import { LeftBar } from 'components/LeftBar';

export const BaseLayout = ({ children }: { children: JSX.Element }) => (
  <>
    <LeftBar />
    {children}
  </>
);
