import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { getAppletPublicLinkApi } from 'api';
import { getErrorMessage } from 'utils/getErrorMessage';

import { StyledTitle } from '../AddUser.styles';
import { LinkForm } from './LinkForm';
import { InviteLink } from './LinkGenerator.types';
import { StyledWrapper } from './LinkGenerator.styles';
import { LinkPopup } from './LinkPopup';

export const LinkGenerator = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const [inviteLink, setInviteLink] = useState<InviteLink | null>(null);
  const [linkPopupVisible, setLinkPopupVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAppletPublicLinkApi({ appletId: id || '' });
        data?.inviteId && setInviteLink(data);
      } catch (e) {
        getErrorMessage(e);
      }
    })();
  }, []);

  return (
    <StyledWrapper>
      <StyledTitle>{t('publicLink')}</StyledTitle>
      {inviteLink ? (
        <LinkForm inviteLink={inviteLink} setInviteLink={setInviteLink} />
      ) : (
        <>
          <Button
            variant="contained"
            onClick={() => setLinkPopupVisible(true)}
            data-testid="generate-btn"
          >
            {t('generateLink')}
          </Button>
          <LinkPopup
            open={linkPopupVisible}
            onClose={() => setLinkPopupVisible(false)}
            setInviteLink={setInviteLink}
          />
        </>
      )}
    </StyledWrapper>
  );
};
