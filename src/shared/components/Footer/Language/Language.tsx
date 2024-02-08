import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Languages } from 'shared/api';
import { StyledLabelMedium, variables } from 'shared/styles';
import { LocalStorageKeys, storage } from 'shared/utils/storage';

import { languages } from './Language.const';
import { StyledLanguage, StyledFlag } from './Language.styles';
import { LanguageItem } from './Language.types';
import { SelectLanguage } from './SelectLanguage';

export const Language = () => {
  const { i18n } = useTranslation('app');
  const langFromStorage = storage.getItem(LocalStorageKeys.Language) || Languages.EN;
  const language = languages.find(lang => lang.value === langFromStorage) as LanguageItem;

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [open, setOpen] = useState(false);

  const handleClose = (language?: LanguageItem) => {
    setOpen(false);
    if (language) {
      const languageValue = language.value;
      i18n.changeLanguage(languageValue);
      storage.setItem(LocalStorageKeys.Language, languageValue);
      setCurrentLanguage(language);
    }
  };

  useEffect(() => {
    if (langFromStorage) {
      i18n.changeLanguage(langFromStorage as string);
    }
  }, [langFromStorage, i18n]);

  return (
    <>
      <Box onClick={() => setOpen(true)}>
        <StyledLanguage>
          <StyledFlag>{currentLanguage.component}</StyledFlag>
          <StyledLabelMedium color={variables.palette.on_surface_variant}>{currentLanguage.label}</StyledLabelMedium>
        </StyledLanguage>
      </Box>
      {open && <SelectLanguage open={open} onClose={handleClose} currentLanguage={currentLanguage} />}
    </>
  );
};
