import { useTranslation } from 'react-i18next';

import { falseReturnFunc } from 'shared/utils';
import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { useNoPermissionSubmit } from 'shared/hooks';

import { NoPermissionPopupProps } from './NoPermissionPopup.types';

export const NoPermissionPopup = ({
  open,
  title,
  onSubmitCallback,
  'data-testid': dataTestid,
}: NoPermissionPopupProps) => {
  const { t } = useTranslation('app');
  const handleNoPermissionSubmit = useNoPermissionSubmit();

  const handleSubmit = () => {
    handleNoPermissionSubmit();
    onSubmitCallback();
  };

  return (
    <Modal
      open={open}
      onClose={falseReturnFunc}
      title={title}
      onSubmit={handleSubmit}
      buttonText={t('refresh')}
      hasCloseIcon={false}
      data-testid={dataTestid}
    >
      <StyledModalWrapper>{t('noAccessToApplet')}</StyledModalWrapper>
    </Modal>
  );
};
