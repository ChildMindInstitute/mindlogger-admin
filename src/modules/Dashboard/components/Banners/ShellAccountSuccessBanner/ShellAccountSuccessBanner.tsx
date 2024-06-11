import { generatePath, useParams, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { page } from 'resources';
import { Banner, BannerProps } from 'shared/components/Banners/Banner';
import { useAppDispatch } from 'redux/store';
import { banners } from 'redux/modules';

import { StyledLinkBtn } from './ShellAccountSuccessBanner.styles';
import { BANNER_DURATION } from './ShellAccountSuccessBanner.const';

export const ShellAccountSuccessBanner = ({ id, ...props }: BannerProps) => {
  const navigate = useNavigate();
  const { appletId } = useParams();
  const dispatch = useAppDispatch();

  const handleRedirectClick = () => {
    navigate(generatePath(page.appletRespondents, { appletId }));
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
          <StyledLinkBtn onClick={handleRedirectClick}>Respondents</StyledLinkBtn> tab.
        </>
      </Trans>
    </Banner>
  );
};
