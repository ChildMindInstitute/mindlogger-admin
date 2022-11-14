import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';

import { Icon } from 'components/Icon';

import {
  StyledAuthHeader,
  StyledHeaderLogo,
  StyledFormControl,
  StyledSelect,
} from './AuthHeader.styles';

export const AuthHeader = () => {
  const { i18n } = useTranslation('app');
  const langFromStorage = sessionStorage.getItem('lang');

  const handleChange = async ({ target: { value } }: SelectChangeEvent<unknown>) => {
    await i18n.changeLanguage(value as string);
    sessionStorage.setItem('lang', value as string);
  };

  useEffect(() => {
    if (langFromStorage) {
      (async () => i18n.changeLanguage(langFromStorage))();
    }
  }, [langFromStorage, i18n]);

  return (
    <StyledAuthHeader>
      <StyledHeaderLogo>
        <Icon.HeaderLogo />
      </StyledHeaderLogo>
      <StyledFormControl size="small">
        <StyledSelect value={i18n.language} onChange={handleChange}>
          <MenuItem value={'en'}>EN</MenuItem>
          <MenuItem value={'fr'}>FR</MenuItem>
        </StyledSelect>
      </StyledFormControl>
    </StyledAuthHeader>
  );
};
