import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { FormControlLabelProps } from '@mui/material';

import { Modal } from 'components';
import { RadioGroupController } from 'components/FormComponents';
import { StyledBodyLarge, StyledLabelLarge, StyledModalWrapper } from 'styles/styledComponents';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import {
  AddToBuilderActions,
  AddToBuilderActionsForm,
  AddToBuilderPopupProps,
} from './AddToBuilderPopup.types';

export const AddToBuilderPopup = ({
  addToBuilderPopupVisible,
  setAddToBuilderPopupVisible,
}: AddToBuilderPopupProps) => {
  const { t } = useTranslation('app');

  const { handleSubmit, control } = useForm({
    defaultValues: {
      addToBuilderAction: AddToBuilderActions.CreateNewApplet,
    },
  });

  const addToBuilderActions: Omit<FormControlLabelProps, 'control'>[] = [
    {
      value: AddToBuilderActions.CreateNewApplet,
      label: (
        <>
          <StyledBodyLarge>{t('createNewApplet')}</StyledBodyLarge>
          <StyledLabelLarge
            sx={{ color: variables.palette.primary, marginTop: theme.spacing(0.4) }}
          >
            {t('createNewAppletHint')}
          </StyledLabelLarge>
        </>
      ),
    },
    {
      value: AddToBuilderActions.AddToExistingApplet,
      label: <StyledBodyLarge>{t('addToExistingApplet')}</StyledBodyLarge>,
    },
  ];

  const handleModalClose = () => setAddToBuilderPopupVisible(false);

  const handleContinue = ({ addToBuilderAction }: AddToBuilderActionsForm) => {
    handleModalClose();
  };

  return (
    <Modal
      open={addToBuilderPopupVisible}
      onClose={handleModalClose}
      onSubmit={handleSubmit(handleContinue)}
      title={t('contentActions')}
      buttonText={t('continue')}
      hasSecondBtn
      secondBtnText={t('cancel')}
      onSecondBtnSubmit={handleModalClose}
    >
      <StyledModalWrapper>
        <form onSubmit={handleSubmit(handleContinue)}>
          <RadioGroupController
            control={control}
            name="addToBuilderAction"
            options={addToBuilderActions}
          />
        </form>
      </StyledModalWrapper>
    </Modal>
  );
};
