import { useState } from 'react';

import { Icon } from 'components/Icon';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { variables } from 'styles/variables';
import avatarSrc from 'assets/images/avatar.png';
import { breadcrumbs } from 'redux/modules';

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
  const breadcrumbsData = breadcrumbs.useData();

  return (
    <>
      <StyledTopBar>
        <StyledLeftBox>
          {breadcrumbsData && <Breadcrumbs breadcrumbs={breadcrumbsData} />}
          <StyledMoreBtn variant="text">
            <Icon.MoreHorizontal color={variables.palette.primary50} />
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
