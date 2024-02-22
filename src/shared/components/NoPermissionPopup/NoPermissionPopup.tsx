import { useTranslation } from 'react-i18next';

import { falseReturnFunc } from 'shared/utils';
import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { useNoPermissionPopup } from './NoPermissionPopup.hooks';

export const NoPermissionPopup = () => {
  const { t } = useTranslation('app');
  const { handleSubmit, noAccessVisible, isBuilder } = useNoPermissionPopup();

  if (!noAccessVisible) return null;

  return (
    <Modal
      open={noAccessVisible}
      onClose={falseReturnFunc}
      title={t('noAccessTitle')}
      onSubmit={handleSubmit}
      buttonText={isBuilder ? t('goToDashboard') : t('refresh')}
      hasCloseIcon={false}
      data-testid="no-permission-popup"
    >
      <StyledModalWrapper>{t('noAccessDescription')}</StyledModalWrapper>
    </Modal>
  );
};
