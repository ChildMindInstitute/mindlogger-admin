import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { Icon } from 'components/Icon';
import { variables } from 'styles/variables';
import { StyledLargeTitle, StyledMediumTitle } from 'styles/styledComponents/Typography';

import { SelectLanguageProps } from './SelectLanguage.types';
import {
  StyledList,
  StyledListItemButton,
  StyledItemContent,
  StyledBox,
  StyledSelect,
  StyledCancelButton,
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
    <Dialog onClose={() => onClose()} open={open}>
      <DialogTitle>{t('chooseLanguageAndRegion')}</DialogTitle>
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
                <StyledLargeTitle fontWeight={'regular'}>{lang.label}</StyledLargeTitle>
                <StyledMediumTitle fontWeight={'regular'} color={variables.palette.shades80}>
                  {lang.type}
                </StyledMediumTitle>
              </StyledBox>
            </StyledItemContent>
            {selectedLanguage.value === lang.value && (
              <StyledSelect>
                <Icon.Selected color={variables.palette.primary50} />
              </StyledSelect>
            )}
          </StyledListItemButton>
        ))}
      </StyledList>
      <DialogActions>
        <StyledCancelButton onClick={() => onClose()}>{t('cancel')}</StyledCancelButton>
        <StyledOkButton onClick={() => onClose(selectedLanguage)}>{t('ok')}</StyledOkButton>
      </DialogActions>
    </Dialog>
  );
};
