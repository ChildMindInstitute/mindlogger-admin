import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material/Select';

import { Icon } from 'components/Icon';

import { StyledAuthHeader, StyledFormControl, StyledSelect } from './AuthHeader.styles';

export const AuthHeader = () => {
  const { i18n } = useTranslation('app');

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    i18n.changeLanguage(event.target.value as string);
  };

  return (
    <StyledAuthHeader>
      <Icon.HeaderLogo />
      <StyledFormControl size="small">
        <StyledSelect value={i18n.language} onChange={handleChange}>
          <MenuItem value={'en'}>EN</MenuItem>
          <MenuItem value={'fr'}>FR</MenuItem>
        </StyledSelect>
      </StyledFormControl>
    </StyledAuthHeader>
  );
};
