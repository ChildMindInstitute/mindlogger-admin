import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledLabelMedium, variables } from 'shared/styles';
import { storage } from 'shared/utils';

import { SelectLanguage } from './SelectLanguage';
import { LanguageItem, Languages } from './Language.types';
import { StyledLanguage, StyledFlag } from './Language.styles';

export const languages: LanguageItem[] = [
  {
    value: Languages.EN,
    label: 'English',
    type: 'United States',
    component: <Svg id="us" width={32} height={24} />,
  },
  {
    value: Languages.FR,
    label: 'Français',
    type: 'France',
    component: <Svg id="france" width={32} height={24} />,
  },
];

export const Language = () => {
  const { i18n } = useTranslation('app');
  const langFromStorage = storage.getItem('lang') || Languages.EN;
  const language = languages.find((lang) => lang.value === langFromStorage) as LanguageItem;

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [open, setOpen] = useState(false);

  const handleClose = (language?: LanguageItem) => {
    setOpen(false);
    if (language) {
      i18n.changeLanguage(language.value);
      storage.setItem('lang', language.value);
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
          <StyledLabelMedium color={variables.palette.on_surface_variant}>
            {currentLanguage.label}
          </StyledLabelMedium>
        </StyledLanguage>
      </Box>
      {open && (
        <SelectLanguage
          open={open}
          onClose={handleClose}
          languages={languages}
          currentLanguage={currentLanguage}
        />
      )}
    </>
  );
};
