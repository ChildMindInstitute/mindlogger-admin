import { useTranslation } from 'react-i18next';
import { FormControl, RadioGroup, Radio } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import { Modal } from 'components';
import { StyledBodyLarge, StyledLabelLarge, StyledModalWrapper } from 'styles/styledComponents';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import { AddToBuilderActions, AddToBuilderPopupProps } from './AddToBuilderPopup.types';
import { StyledFormControlLabel } from './AddToBuilderPopup.styles';

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

  const handleModalClose = () => setAddToBuilderPopupVisible(false);

  const handleContinue = ({ addToBuilderAction }: { addToBuilderAction: AddToBuilderActions }) => {
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
          <FormControl component="fieldset">
            <Controller
              control={control}
              name="addToBuilderAction"
              render={({ field }) => (
                <RadioGroup {...field}>
                  <StyledFormControlLabel
                    value={AddToBuilderActions.CreateNewApplet}
                    control={<Radio />}
                    label={
                      <>
                        <StyledBodyLarge>{t('createNewApplet')}</StyledBodyLarge>
                        <StyledLabelLarge
                          sx={{ color: variables.palette.primary, marginTop: theme.spacing(0.4) }}
                        >
                          {t('createNewAppletHint')}
                        </StyledLabelLarge>
                      </>
                    }
                  />
                  <StyledFormControlLabel
                    value={AddToBuilderActions.AddToExistingApplet}
                    control={<Radio />}
                    label={<StyledBodyLarge>{t('addToExistingApplet')}</StyledBodyLarge>}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </form>
      </StyledModalWrapper>
    </Modal>
  );
};
