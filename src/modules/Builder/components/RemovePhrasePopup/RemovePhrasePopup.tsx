import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Modal, ModalProps } from 'shared/components';
import { StyledFlexAllCenter, StyledFlexTopStart } from 'shared/styles';

export const RemovePhrasePopup = ({
  onRemove,
  ...otherProps
}: Omit<ModalProps, 'title' | 'children'> & { onRemove?: () => void }) => {
  const { t } = useTranslation('app');

  return (
    <Modal
      footer={
        <StyledFlexAllCenter sx={{ width: '100%' }}>
          <Button color="error" onClick={onRemove} variant="contained">
            {t('phrasalTemplateRemovePopup.confirm')}
          </Button>
        </StyledFlexAllCenter>
      }
      hasActions={false}
      title={t('phrasalTemplateRemovePopup.title')}
      {...otherProps}
    >
      <StyledFlexTopStart as="p" sx={{ px: 3.2, m: 0, pt: 2.4 }}>
        {t('phrasalTemplateRemovePopup.areYouSure')}
      </StyledFlexTopStart>
    </Modal>
  );
};
