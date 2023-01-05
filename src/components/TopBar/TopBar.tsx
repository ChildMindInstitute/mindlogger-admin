import { useEffect, useState } from 'react';

import { Breadcrumbs } from 'components/Breadcrumbs';
import { useAppDispatch } from 'redux/store';
import { account, auth } from 'redux/modules';
import { variables } from 'styles/variables';
import { StyledLabelBoldMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import avatarSrc from 'assets/images/avatar.png';

import { AccountPanel } from './AccountPanel';
import { StyledTopBar, StyledAvatarBtn, StyledImage, StyledQuantity } from './TopBar.styles';

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
        <StyledFlexTopCenter>
          <Breadcrumbs />
        </StyledFlexTopCenter>
        <StyledAvatarBtn onClick={() => setShowAccDrawer((prevState) => !prevState)} variant="text">
          <StyledImage src={avatarSrc} alt="Avatar" />
          {alertsQuantity > 0 && (
            <StyledQuantity>
              <StyledLabelBoldMedium color={variables.palette.white}>
                {alertsQuantity}
              </StyledLabelBoldMedium>
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
