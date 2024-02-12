import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components/Modal';
import { InputController } from 'shared/components/FormComponents/InputController';
import { StyledErrorText, theme } from 'shared/styles';

import { SourceLinkModalForm, SourceLinkModalFormValues, SourceLinkModalProps } from './SourceLinkModal.types';
import { StyledController, StyledModalWrapper } from './SourceLinkModal.styles';

export const SourceLinkModal = ({ title, error, handleClose, handleSubmit }: SourceLinkModalProps) => {
  const { t } = useTranslation('app');
  const { control, getValues } = useForm<SourceLinkModalForm>({
    defaultValues: { label: '', address: '' },
  });
  const dataTestid = 'md-editor-source-link-popup';
  const onSubmit = () => {
    handleSubmit(getValues());
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      onSubmit={onSubmit}
      title={title}
      buttonText={t('ok')}
      width="32"
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        <form onSubmit={onSubmit} noValidate>
          <StyledController>
            <InputController
              fullWidth
              name={SourceLinkModalFormValues.Label}
              control={control}
              label={t('description')}
              placeholder={t('enterDescription')}
              data-testid={`${dataTestid}-description`}
            />
          </StyledController>
          <StyledController>
            <InputController
              fullWidth
              name={SourceLinkModalFormValues.Address}
              control={control}
              label={t('link')}
              placeholder={t('enterLink')}
              data-testid={`${dataTestid}-link`}
            />
          </StyledController>
        </form>
        {error && <StyledErrorText sx={{ marginTop: theme.spacing(1) }}>{t(error)}</StyledErrorText>}
      </StyledModalWrapper>
    </Modal>
  );
};
