import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { postAppletPublicLinkApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { Svg } from 'shared/components';

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
  const { execute } = useAsync(postAppletPublicLinkApi, (res) => {
    res?.data && setInviteLink(res.data);
    onClose();
  });

  const postAppletLink = async (requireLogin: boolean) => {
    await execute({ appletId: id || '', requireLogin });
  };

  return (
    <StyledDialog data-testid="modal" onClose={onClose} open={open}>
      <StyledDialogTitle align="left">
        {t('publicLink')}
        <StyledCloseButton onClick={onClose}>
          <Svg id="cross" />
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
