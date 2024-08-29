import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { DeletePopupProps } from './DeletePopup.types';

export const DeletePopup = ({
  isVisible,
  setIsVisible,
  onConfirm,
  activityName,
  ...rest
}: DeletePopupProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  return (
    <Modal
      open={isVisible}
      onClose={() => setIsVisible(false)}
      width="66"
      title={t('deletePopupTitle')}
      hasActions
      buttonText={t('deletePopupButton')}
      submitBtnColor="error"
      onSubmit={() => {
        onConfirm();
        setIsVisible(false);
      }}
      {...rest}
    >
      <StyledModalWrapper>
        <Trans
          i18nKey="activityAssign.deletePopupText"
          components={[<strong />]}
          values={{ activityName }}
        />
      </StyledModalWrapper>
    </Modal>
  );
};
