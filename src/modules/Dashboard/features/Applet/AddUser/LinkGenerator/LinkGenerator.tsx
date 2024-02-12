import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { getAppletPublicLinkApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { StyledFlexTopCenter, StyledTitleBoldMedium, theme } from 'shared/styles';
import { Tooltip } from 'shared/components/Tooltip';
import { Mixpanel } from 'shared/utils/mixpanel';

import { StyledTitle } from '../AddUser.styles';
import { LinkForm } from './LinkForm';
import { InviteLink } from './LinkGenerator.types';
import { StyledSvg, StyledWrapper } from './LinkGenerator.styles';
import { LinkPopup } from '../Popups/LinkPopup';

export const LinkGenerator = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams() || {};
  const [inviteLink, setInviteLink] = useState<InviteLink | null>(null);
  const [linkPopupVisible, setLinkPopupVisible] = useState(false);

  const { execute } = useAsync(getAppletPublicLinkApi, (res) => {
    res?.data?.result && setInviteLink(res.data.result);
  });

  const handleGeneratePublicLinkClick = () => {
    setLinkPopupVisible(true);
  };

  const onLinkCreated = (link: InviteLink | null) => {
    setInviteLink(link);

    Mixpanel.track('Public Link generate click');
  };

  useEffect(() => {
    appletId && execute({ appletId });
  }, []);

  return (
    <StyledWrapper>
      <StyledTitle sx={{ mt: theme.spacing(4.9) }}>
        <StyledTitleBoldMedium>{t('publicLink')}</StyledTitleBoldMedium>
        <Tooltip tooltipTitle={t('publicLinkTooltip')}>
          <StyledFlexTopCenter>
            <StyledSvg id="more-info-outlined" />
          </StyledFlexTopCenter>
        </Tooltip>
      </StyledTitle>
      {inviteLink ? (
        <LinkForm inviteLink={inviteLink} setInviteLink={setInviteLink} />
      ) : (
        <>
          <Button
            variant="contained"
            onClick={handleGeneratePublicLinkClick}
            data-testid="dashboard-add-users-generate-link-generate"
          >
            {t('generateLink')}
          </Button>
          <LinkPopup open={linkPopupVisible} onClose={() => setLinkPopupVisible(false)} onSubmit={onLinkCreated} />
        </>
      )}
    </StyledWrapper>
  );
};
