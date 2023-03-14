import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { getAppletPublicLinkApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';

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

  const { execute } = useAsync(getAppletPublicLinkApi, (res) => {
    res?.data?.inviteId && setInviteLink(res.data);
  });

  useEffect(() => {
    execute({ appletId: id || '' });
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
