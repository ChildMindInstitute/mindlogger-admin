import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { deleteAppletPublicLinkApi } from 'api';
import { getErrorMessage } from 'shared/utils/errors';
import { StyledBodyMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { Svg } from 'shared/components';

import { StyledButton, StyledInput } from './LinkForm.styles';
import { LinkGeneratorProps } from '../LinkGenerator.types';
import { DeletePopup } from '../../Popups';

export const LinkForm = ({ inviteLink, setInviteLink }: LinkGeneratorProps) => {
  const { appletId: id } = useParams();
  const { t } = useTranslation('app');

  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const publicLink = inviteLink?.link || '';

  const deleteAppletPublicLink = async () => {
    try {
      if (id) {
        await deleteAppletPublicLinkApi({ appletId: id });
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
      <StyledBodyMedium>
        {inviteLink?.requireLogin ? t('shareWithLogin') : t('shareWithNoLogin')}
      </StyledBodyMedium>
      <StyledFlexTopCenter>
        <StyledInput
          label=""
          defaultValue={publicLink}
          InputProps={{
            readOnly: true,
          }}
          data-testid="generated-input"
        />
        <StyledButton variant="outlined" onClick={copyPublicLink}>
          <Svg id="duplicate" />
        </StyledButton>
      </StyledFlexTopCenter>
      <StyledFlexTopCenter>
        <StyledButton variant="outlined" onClick={() => setDeletePopupVisible(true)}>
          {t('deleteInviteLink')}
        </StyledButton>
        <StyledBodyMedium>{t('deleteLinkToNoAllow')}</StyledBodyMedium>
      </StyledFlexTopCenter>
      {deletePopupVisible && (
        <DeletePopup
          open={deletePopupVisible}
          onClose={() => setDeletePopupVisible(false)}
          onSubmit={deleteAppletPublicLink}
        />
      )}
    </>
  );
};
