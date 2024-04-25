import { useParams, Link } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';
import { useAppDispatch } from 'redux/store';
import { banners } from 'redux/modules';
import { useMultiInformantParticipantPath } from 'shared/hooks/useMultiInformantParticipantPath';

import { StyledLinkBtn } from './ShellAccountSuccessBanner.styles';
import { BANNER_DURATION } from './ShellAccountSuccessBanner.const';

export const ShellAccountSuccessBanner = ({ id, ...props }: BannerProps) => {
  const { appletId } = useParams();
  const participantPath = useMultiInformantParticipantPath({ appletId });
  const dispatch = useAppDispatch();

  const handleRedirectClick = () => {
    dispatch(banners.actions.removeBanner({ key: 'ShellAccountSuccessBanner' }));
  };

  return (
    <Banner duration={BANNER_DURATION} severity="success" {...props}>
      <Trans i18nKey="requestShellAccountSuccess">
        <>
          Shell account
          <strong>
            <>{{ id }}</>
          </strong>
          was successfully created and is available on the
          <StyledLinkBtn component={Link} to={participantPath} onClick={handleRedirectClick}>
            Respondents
          </StyledLinkBtn>
          tab.
        </>
      </Trans>
    </Banner>
  );
};
