import { useState } from 'react';

import { Svg } from 'components/Svg';
import { Breadcrumbs } from 'components/Breadcrumbs';
import avatarSrc from 'assets/images/avatar.png';

import { AccountPanel } from './AccountPanel';
import {
  StyledTopBar,
  StyledLeftBox,
  StyledMoreBtn,
  StyledAvatarBtn,
  StyledImage,
} from './TopBar.styles';

export const TopBar = (): JSX.Element => {
  const [showAccDrawer, setShowAccDrawer] = useState(false);

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
        </StyledAvatarBtn>
      </StyledTopBar>
      {showAccDrawer && (
        <AccountPanel setShowDrawer={setShowAccDrawer} showDrawer={showAccDrawer} />
      )}
    </>
  );
};
