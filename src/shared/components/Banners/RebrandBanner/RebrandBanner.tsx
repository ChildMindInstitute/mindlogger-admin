import { Box, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import curiousIcon from 'assets/images/curious_icon--white.png';
import { auth } from 'redux/modules';
import { variables } from 'shared/styles';

import { Banner, BannerProps } from '../Banner';
import { StyledImg, StyledLink } from './RebrandBanner.styles';

const CURIOUS_REBRAND_URL = 'https://www.gettingcurious.com/rebrand';

/**
 * Returns a unique key for the rebrand banner dismiss state
 * It creates a user-only key for use on the auth screen
 */
export const getDismissedKey = (userId: string) => `rebrand-banner-dismissed-${userId}`;

// Global key for anonymous users (e.g., on the login screen)
export const GLOBAL_DISMISSED_KEY = 'rebrand-banner-dismissed-global';

const DISPLAY_ROUTES = [/^\/auth(?:\/|$)/, /^\/dashboard\/(applets|managers|respondents)$/];

export const RebrandBanner = (props: BannerProps) => {
  const userData = auth.useData();
  const userId = userData?.user.id;
  const location = useLocation();

  const [isRebrandBannerActive, setIsRebrandBannerActive] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const handleOnExited = () => {
    if (isCollapsing) {
      setIsCollapsing(false);
      setIsRebrandBannerActive(false);
    }
  };

  useEffect(() => {
    // For auth screen or when user is not logged in yet
    if (!userId) {
      const globalDismissed = localStorage.getItem(GLOBAL_DISMISSED_KEY);
      setIsRebrandBannerActive(!globalDismissed);

      return;
    }

    // For logged-in users
    const userDismissed = localStorage.getItem(getDismissedKey(userId));

    setIsRebrandBannerActive(!userDismissed);
  }, [userId]);

  const isDisplayRoute = DISPLAY_ROUTES.some((route) => route.test(location.pathname));

  const handleDismiss = () => {
    // For auth screen or when user is not logged in yet
    if (!userId) {
      localStorage.setItem(GLOBAL_DISMISSED_KEY, 'true');
    } else {
      // Set user-level dismissal
      localStorage.setItem(getDismissedKey(userId), 'true');
    }

    setIsCollapsing(true);
  };

  // Don't render if not on a display route or if no user info is available on non-auth routes
  const shouldRender = isDisplayRoute && (location.pathname.startsWith('/auth') || userId);

  return shouldRender ? (
    <Box>
      <Collapse in={isRebrandBannerActive && !isCollapsing} enter={false} onExited={handleOnExited}>
        {isRebrandBannerActive && (
          <Banner
            duration={null}
            severity={undefined}
            data-testid="rebrand-banner"
            onClose={(reason) => {
              if (reason === 'manual') {
                handleDismiss();
              }
            }}
            icon={<StyledImg src={curiousIcon} />}
            sx={{
              backgroundColor: '#0B0907',
              color: variables.palette.surface,
              '& .MuiAlert-message': {
                maxWidth: 'none',
              },
              '& .MuiButton-root': {
                color: variables.palette.surface,
              },
            }}
            {...props}
          >
            <Trans i18nKey="rebrandBanner">
              <strong>We are rebranding! </strong>
              <>Design updates are on the way — same great app, fresh new look. Curious? </>
              <StyledLink href={CURIOUS_REBRAND_URL} target="_blank">
                Click to learn more.
              </StyledLink>
            </Trans>
          </Banner>
        )}
      </Collapse>
    </Box>
  ) : null;
};
