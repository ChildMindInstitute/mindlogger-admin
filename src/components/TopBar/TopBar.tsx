import { useEffect, useState } from 'react';

import { Svg } from 'components/Svg';
import { Breadcrumbs } from 'components/Breadcrumbs';
import avatarSrc from 'assets/images/avatar.png';
import { useAppDispatch } from 'redux/store';
import { account, auth } from 'redux/modules';

import { variables } from 'styles/variables';
import { StyledLabelMedium } from 'styles/styledComponents/Typography';

import { AccountPanel } from './AccountPanel';
import {
  StyledTopBar,
  StyledLeftBox,
  StyledMoreBtn,
  StyledAvatarBtn,
  StyledImage,
  StyledQuantity,
} from './TopBar.styles';

export const TopBar = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const authData = auth.useData();
  const accData = account.useData();
  const [showAccDrawer, setShowAccDrawer] = useState(false);
  const [alertsQuantity, setAlertsQuantity] = useState(0);

  useEffect(() => {
    if (authData) {
      const { accountId } = authData.account;
      (async () => await dispatch(account.thunk.switchAccount({ accountId })))();
    }
  }, [authData, dispatch]);

  useEffect(() => {
    if (accData) {
      const quantity = accData.account.alerts.list.filter((alert) => !alert.viewed).length;
      setAlertsQuantity(quantity);
    }
  }, [accData]);

  return (
    <>
      <StyledTopBar>
        <StyledLeftBox>
          <Breadcrumbs />
          <StyledMoreBtn variant="text">
            <Svg id="more-horizontal" />
          </StyledMoreBtn>
        </StyledLeftBox>
        <StyledAvatarBtn onClick={() => setShowAccDrawer((prevState) => !prevState)} variant="text">
          <StyledImage src={avatarSrc} alt="Avatar" />
          {alertsQuantity > 0 && (
            <StyledQuantity>
              <StyledLabelMedium fontWeight="semiBold" color={variables.palette.white}>
                {alertsQuantity}
              </StyledLabelMedium>
            </StyledQuantity>
          )}
        </StyledAvatarBtn>
      </StyledTopBar>
      {showAccDrawer && (
        <AccountPanel
          alertsQuantity={alertsQuantity}
          setShowDrawer={setShowAccDrawer}
          showDrawer={showAccDrawer}
        />
      )}
    </>
  );
};
