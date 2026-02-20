import { Box, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import curiousIcon from 'assets/images/curious_icon--white.png';
import { auth } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { variables } from 'shared/styles';

import { Banner, BannerProps } from '../Banner';
import { StyledImg, StyledLink } from './AnnouncementBanner.styles';

// ─── Update this URL when the announcement changes ────────────────────────────
const ANNOUNCEMENT_URL = 'https://mindlogger.atlassian.net/servicedesk/customer/portal/3/topic/ca0a323b-b88d-4b32-8f4f-4e6b0157f8f6/article/1545404417';
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a unique key for the announcement banner dismiss state
 * It creates a user-only key for use on the auth screen
 */
export const getDismissedKey = (userId: string) => `announcement-banner-dismissed-${userId}`;

// Global key for anonymous users (e.g., on the login screen)
export const GLOBAL_DISMISSED_KEY = 'announcement-banner-dismissed-global';

const DISPLAY_ROUTES = [/^\/auth(?:\/|$)/, /^\/dashboard\/(applets|managers|respondents)$/];

export const AnnouncementBanner = (props: BannerProps) => {
  const { featureFlags } = useFeatureFlags();
  const userData = auth.useData();
  const userId = userData?.user.id;
  const location = useLocation();

  const [isAnnouncementBannerActive, setIsAnnouncementBannerActive] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const handleOnExited = () => {
    if (isCollapsing) {
      setIsCollapsing(false);
      setIsAnnouncementBannerActive(false);
    }
  };

  useEffect(() => {
    if (!featureFlags.enableAdminAnnouncementBanner) return;

    // For auth screen or when user is not logged in yet
    if (!userId) {
      const globalDismissed = localStorage.getItem(GLOBAL_DISMISSED_KEY);
      setIsAnnouncementBannerActive(!globalDismissed);

      return;
    }

    // For logged-in users
    const userDismissed = localStorage.getItem(getDismissedKey(userId));

    setIsAnnouncementBannerActive(!userDismissed);
  }, [userId, featureFlags.enableAdminAnnouncementBanner]);

  if (!featureFlags.enableAdminAnnouncementBanner) return null;

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
      <Collapse
        in={isAnnouncementBannerActive && !isCollapsing}
        enter={false}
        onExited={handleOnExited}
      >
        {isAnnouncementBannerActive && (
          <Banner
            duration={null}
            severity={undefined}
            data-testid="announcement-banner"
            onClose={(reason) => {
              if (reason === 'manual') {
                handleDismiss();
              }
            }}
            icon={<StyledImg src={curiousIcon} />}
            sx={{
              backgroundColor: variables.palette.primary,
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
            <Trans i18nKey="announcementBanner">
              <strong>We are rebranding! </strong>
              <>Design updates are on the way — same great app, fresh new look. Curious? </>
              <StyledLink href={ANNOUNCEMENT_URL} target="_blank">
                Click to learn more.
              </StyledLink>
            </Trans>
          </Banner>
        )}
      </Collapse>
    </Box>
  ) : null;
};
