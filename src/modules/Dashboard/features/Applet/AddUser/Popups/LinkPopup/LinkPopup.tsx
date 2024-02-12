import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { postAppletPublicLinkApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { Modal } from 'shared/components';
import { StyledBodyLarge, StyledModalWrapper, theme, variables } from 'shared/styles';

import { LinkPopupProps } from './LinkPopup.types';

export const LinkPopup = ({ open, onClose, onSubmit }: LinkPopupProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams() || {};
  const { execute } = useAsync(postAppletPublicLinkApi, (res) => {
    onSubmit(res?.data.result);
    onClose();
  });

  const postAppletLink = (requireLogin: boolean) => {
    appletId && execute({ appletId, requireLogin });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={() => postAppletLink(true)}
      onSecondBtnSubmit={() => postAppletLink(false)}
      onThirdBtnSubmit={onClose}
      title={t('generatePublicLink')}
      buttonText={t('generateLinkYes')}
      secondBtnText={t('generateLinkNo')}
      thirdBtnText={t('cancel')}
      hasSecondBtn
      hasThirdBtn
      secondBtnStyles={{
        fontWeight: variables.font.weight.bold,
      }}
      data-testid="dashboard-add-users-generate-link-generate-popup"
      width="70"
    >
      <StyledModalWrapper>
        <StyledBodyLarge sx={{ mt: theme.spacing(-1) }}>
          {t('requireToCreateAccount')}
        </StyledBodyLarge>
      </StyledModalWrapper>
    </Modal>
  );
};
