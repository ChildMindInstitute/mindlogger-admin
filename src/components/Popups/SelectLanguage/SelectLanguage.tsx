import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, DialogTitle } from '@mui/material';

import { Svg } from 'components/Svg';
import { variables } from 'styles/variables';
import { StyledTitleMedium, StyledTitleSmall } from 'styles/styledComponents/Typography';

import { SelectLanguageProps } from './SelectLanguage.types';
import {
  StyledDialog,
  StyledCloseButton,
  StyledList,
  StyledListItemButton,
  StyledItemContent,
  StyledBox,
  StyledSelect,
  StyledDialogActions,
  StyledOkButton,
} from './SelectLanguage.styles';

export const SelectLanguage = ({
  onClose,
  open,
  currentLanguage,
  languages,
}: SelectLanguageProps) => {
  const { t } = useTranslation('app');

  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  return (
    <StyledDialog onClose={() => onClose()} open={open}>
      <DialogTitle>
        {t('chooseLanguage')}
        <StyledCloseButton onClick={() => onClose()}>
          <Svg width={14} height={14} id="cross" />
        </StyledCloseButton>
      </DialogTitle>
      <StyledList>
        {languages.map((lang) => (
          <StyledListItemButton
            key={lang.value}
            selected={selectedLanguage.value === lang.value}
            onClick={() => setSelectedLanguage(lang)}
          >
            <StyledItemContent>
              <Box>{lang.component}</Box>
              <StyledBox>
                <StyledTitleMedium fontWeight={'regular'}>{lang.label}</StyledTitleMedium>
                <StyledTitleSmall
                  fontWeight={'regular'}
                  color={variables.palette.on_surface_variant}
                >
                  {lang.type}
                </StyledTitleSmall>
              </StyledBox>
            </StyledItemContent>
            {selectedLanguage.value === lang.value && (
              <StyledSelect>
                <Svg id="selected" />
              </StyledSelect>
            )}
          </StyledListItemButton>
        ))}
      </StyledList>
      <StyledDialogActions>
        <StyledOkButton onClick={() => onClose(selectedLanguage)}>{t('ok')}</StyledOkButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};
