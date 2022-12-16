import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { postAppletPublicLinkApi } from 'api';
import { getErrorMessage } from 'utils/getErrorMessage';
import { Svg } from 'components/Svg';

import {
  StyledDialog,
  StyledDialogTitle,
  StyledContent,
  StyledCloseButton,
  StyledDialogActions,
  StyledButton,
} from './LinkPopup.styles';
import { LinkPopupProps } from './LinkPopup.types';

export const LinkPopup = ({ open, onClose, setInviteLink }: LinkPopupProps) => {
  const { t } = useTranslation('app');
  const { id } = useParams();

  const postAppletLink = async (requireLogin: boolean) => {
    try {
      const { data } = await postAppletPublicLinkApi({
        appletId: id || '',
        requireLogin,
      });
      data && setInviteLink(data);
      onClose();
    } catch (e) {
      getErrorMessage(e);
    }
  };

  return (
    <StyledDialog data-testid="modal" onClose={onClose} open={open}>
      <StyledDialogTitle align="left">
        {t('publicLink')}
        <StyledCloseButton onClick={onClose}>
          <Svg width={24} height={24} id="cross" />
        </StyledCloseButton>
      </StyledDialogTitle>

      <StyledContent>{t('requireToCreateAccount')}</StyledContent>

      <StyledDialogActions>
        <StyledButton
          data-testid="generate-with-login"
          variant="text"
          onClick={() => postAppletLink(true)}
        >
          {t('yes')}
        </StyledButton>
        <StyledButton
          data-testid="generate-witout-login"
          variant="text"
          onClick={() => postAppletLink(false)}
        >
          {t('no')}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};
