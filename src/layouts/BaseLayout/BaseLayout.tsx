import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { LeftBar } from 'components/LeftBar';
import { TopBar } from 'components/TopBar';
import { Footer } from 'layouts/Footer';
import { users } from 'redux/modules';
import { useAppDispatch } from 'redux/store';

import { StyledBaseLayout, StyledCol } from './BaseLayout.styles';

export const BaseLayout = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(users.thunk.getManagersList());
    dispatch(users.thunk.getUsersList());
  }, [dispatch]);

  return (
    <StyledBaseLayout>
      <LeftBar />
      <StyledCol>
        <TopBar />
        <Outlet />
        <Footer />
      </StyledCol>
    </StyledBaseLayout>
  );
};
