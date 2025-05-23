import { Box, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import curiousLogo from 'assets/images/curious_logo--white.png';
import { auth, workspaces } from 'redux/modules';
import { theme, variables } from 'shared/styles';

import { Banner, BannerProps } from '../Banner';
import { StyledImg } from './RebrandBanner.styles';

/**
 * Returns a unique key for the rebrand banner dismiss state for a given user and workspace, in this
 * format: `rebrand-banner-dismissed-{userId}:{workspaceId}`
 */
export const getDismissedKey = (userId: string, workspaceId: string) =>
  `rebrand-banner-dismissed-${userId}:${workspaceId}`;

const MAIN_ROUTES = ['/dashboard/applets', '/dashboard/managers', '/dashboard/respondents'];

export const RebrandBanner = (props: BannerProps) => {
  const { ownerId } = workspaces.useData() ?? {};
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
    if (!userId || !ownerId) return;

    const dismissed = localStorage.getItem(getDismissedKey(userId, ownerId));

    if (!dismissed) {
      setIsRebrandBannerActive(true);
    } else {
      setIsRebrandBannerActive(false);
    }
  }, [userId, ownerId]);

  const isMainRoute = MAIN_ROUTES.includes(location.pathname);

  return userId && ownerId && isMainRoute ? (
    <Box>
      <Collapse in={isRebrandBannerActive && !isCollapsing} enter={false} onExited={handleOnExited}>
        {isRebrandBannerActive && (
          <Banner
            duration={null}
            severity={undefined}
            data-testid="rebrand-banner"
            onClose={(reason) => {
              if (reason === 'manual') {
                localStorage.setItem(getDismissedKey(userId, ownerId), 'true');
                setIsCollapsing(true);
              }
            }}
            icon={<StyledImg src={curiousLogo} />}
            sx={{
              backgroundColor: '#000',
              color: variables.palette.surface,
              '& .MuiAlert-message': {
                maxWidth: theme.spacing(90),
              },
              '& .MuiAlert-icon': {
                opacity: 1,
              },
              '& .MuiButton-root': {
                color: variables.palette.surface,
              },
            }}
            {...props}
          >
            <Trans i18nKey="rebrandBannerNoLink">
              <strong>We are rebranding! </strong>
              <>Design updates are on the way — same great app, fresh new look. Curious? </>
              {/* 
								Uncomment once the URL is available
								https://mindlogger.atlassian.net/browse/M2-9258
							*/}
              {/* <StyledLink href={CURIOUS_REBRAND_URL} target="_blank">
                Click to learn more.
              </StyledLink> */}
            </Trans>
          </Banner>
        )}
      </Collapse>
    </Box>
  ) : null;
};
