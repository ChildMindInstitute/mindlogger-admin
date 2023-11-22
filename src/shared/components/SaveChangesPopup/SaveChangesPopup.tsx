import { useTranslation } from 'react-i18next';

import { StyledBodyLarge, StyledModalWrapper } from 'shared/styles';
import { Svg } from 'shared/components/Svg';

import { SaveChangesPopupProps } from './SaveChangesPopup.types';
import {
  StyledDialog,
  StyledDialogTitle,
  StyledCloseButton,
  StyledDialogActions,
  StyledButton,
  StyledButtonsContainer,
} from './SaveChangesPopup.styles';

export const SaveChangesPopup = ({
  popupVisible,
  onDontSave,
  onCancel,
  onSave,
  'data-testid': dataTestid,
}: SaveChangesPopupProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledDialog onClose={onCancel} open={popupVisible} data-testid={dataTestid}>
      <StyledDialogTitle>
        {t('saveChanges')}
        <StyledCloseButton onClick={onCancel}>
          <Svg id="cross" />
        </StyledCloseButton>
      </StyledDialogTitle>
      <StyledModalWrapper>
        <StyledBodyLarge>{t('saveChangesDescription')}</StyledBodyLarge>
      </StyledModalWrapper>
      <StyledDialogActions>
        <StyledButtonsContainer>
          <StyledButton fontWeight="regular" variant="text" onClick={onCancel}>
            {t('cancel')}
          </StyledButton>
        </StyledButtonsContainer>
        <StyledButtonsContainer>
          <StyledButton fontWeight="bold" variant="text" onClick={onDontSave} color="error">
            {t('dontSave')}
          </StyledButton>
          <StyledButton
            fontWeight="bold"
            variant="text"
            onClick={onSave}
            data-testid={`${dataTestid}-save-button`}
          >
            {t('save')}
          </StyledButton>
        </StyledButtonsContainer>
      </StyledDialogActions>
    </StyledDialog>
  );
};
