import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getAppletPublicLinkApi } from 'api';
import { getErrorMessage } from 'utils/getErrorMessage';

import { StyledTitle } from '../AddUser.styles';
import { LinkForm } from './LinkForm';
import { IinviteLink } from './LinkGenerator.types';
import { LinkModal } from './LinkModal';

export const LinkGenerator = () => {
  const { id } = useParams();
  const [inviteLink, setInviteLink] = useState<IinviteLink | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const { data } = await getAppletPublicLinkApi({ appletId: id });
          setInviteLink(data);
        } catch (e) {
          getErrorMessage(e);
        }
      }
    })();
  }, []);

  return (
    <>
      <StyledTitle>Public Link</StyledTitle>
      {inviteLink ? (
        <LinkForm inviteLink={inviteLink} setInviteLink={setInviteLink} />
      ) : (
        <LinkModal setInviteLink={setInviteLink} />
      )}
    </>
  );
};
