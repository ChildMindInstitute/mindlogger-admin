import { Trans } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';
import { SessionStorageKeys } from 'shared/utils/storage';

import { StyledReloadLink } from './SessionElsewhereBanner.styles';

// The note that kept this boot out of a session that was not its own. Going in is the choice being
// made here, so it goes with it.
const reloadIntoSession = () => {
  sessionStorage.removeItem(SessionStorageKeys.SessionEnded);
  window.location.reload();
};

export const SessionElsewhereBanner = (props: BannerProps) => (
  <Banner duration={null} severity="warning" data-testid="session-elsewhere-banner" {...props}>
    <Trans i18nKey="sessionElsewhereBanner">
      <>You signed in with another tab or window.</>
      <StyledReloadLink component="button" onClick={reloadIntoSession}>
        Reload
      </StyledReloadLink>
      <> to refresh your session.</>
    </Trans>
  </Banner>
);
