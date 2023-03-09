import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components';
import { InputController } from 'components/FormComponents';

import {
  SourceLinkModalForm,
  SourceLinkModalFormValues,
  SourceLinkModalProps,
} from './SourceLinkModal.types';
import { StyledController, StyledModalWrapper } from './SourceLinkModal.styles';

export const SourceLinkModal = ({ title, handleClose, handleSubmit }: SourceLinkModalProps) => {
  const { t } = useTranslation('app');
  const { control, getValues } = useForm<SourceLinkModalForm>({
    defaultValues: { label: '', address: '' },
  });
  const onSubmit = () => {
    handleSubmit(getValues());
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      onSubmit={onSubmit}
      title={title}
      buttonText={t('mdEditorOK')}
      width="32"
    >
      <StyledModalWrapper>
        <form onSubmit={onSubmit} noValidate>
          <StyledController>
            <InputController
              fullWidth
              name={SourceLinkModalFormValues.Label}
              control={control}
              label={t('mdEditorDescription')}
              placeholder={t('mdEditorEnterDescription')}
            />
          </StyledController>
          <StyledController>
            <InputController
              fullWidth
              name={SourceLinkModalFormValues.Address}
              control={control}
              label={t('mdEditorLink')}
              placeholder={t('mdEditorEnterLink')}
            />
          </StyledController>
        </form>
      </StyledModalWrapper>
    </Modal>
  );
};
