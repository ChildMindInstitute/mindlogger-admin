import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getAppletPublicLinkApi } from 'api';
import { getErrorMessage } from 'utils/getErrorMessage';

import { StyledTitle } from '../AddUser.styles';
import { LinkForm } from './LinkForm';
import { InviteLink } from './LinkGenerator.types';
import { LinkModal } from './LinkModal';
import { StyledWrapper } from './LinkGenerator.styles';

export const LinkGenerator = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const [inviteLink, setInviteLink] = useState<InviteLink | null>(null);

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
        <LinkModal setInviteLink={setInviteLink} />
      )}
    </StyledWrapper>
  );
};
