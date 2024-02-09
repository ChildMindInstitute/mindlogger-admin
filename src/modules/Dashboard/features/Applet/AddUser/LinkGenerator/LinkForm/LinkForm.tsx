import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { deleteAppletPublicLinkApi } from 'api';
import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { getErrorMessage } from 'shared/utils/errors';

import { DeletePublicLinkPopup } from '../../Popups';
import { LinkGeneratorProps } from '../LinkGenerator.types';
import { StyledButton, StyledInput } from './LinkForm.styles';

export const LinkForm = ({ inviteLink, setInviteLink }: LinkGeneratorProps) => {
  const { appletId } = useParams() || {};
  const { t } = useTranslation('app');

  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const publicLink = inviteLink?.link || '';

  const deleteAppletPublicLink = async () => {
    try {
      if (appletId) {
        await deleteAppletPublicLinkApi({ appletId });
        setInviteLink(null);
      }
    } catch (e) {
      getErrorMessage(e);
    }
  };

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
  };

  return (
    <>
      <StyledBodyMedium>{inviteLink?.requireLogin ? t('shareWithLogin') : t('shareWithNoLogin')}</StyledBodyMedium>
      <StyledFlexTopCenter>
        <StyledInput
          label=""
          defaultValue={publicLink}
          InputProps={{
            readOnly: true,
          }}
          data-testid="dashboard-add-users-generate-link-url"
        />
        <StyledButton
          variant="outlined"
          onClick={copyPublicLink}
          data-testid="dashboard-add-users-generate-link-url-copy"
        >
          <Svg id="duplicate" />
        </StyledButton>
      </StyledFlexTopCenter>
      <StyledFlexTopCenter>
        <StyledButton
          variant="outlined"
          onClick={() => setDeletePopupVisible(true)}
          data-testid="dashboard-add-users-generate-link-url-delete"
        >
          {t('deleteInviteLink')}
        </StyledButton>
        <StyledBodyMedium>{t('deleteLinkToNoAllow')}</StyledBodyMedium>
      </StyledFlexTopCenter>
      {deletePopupVisible && (
        <DeletePublicLinkPopup
          open={deletePopupVisible}
          onClose={() => setDeletePopupVisible(false)}
          onSubmit={deleteAppletPublicLink}
        />
      )}
    </>
  );
};
