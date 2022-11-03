import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputLabel, MenuItem, SelectChangeEvent } from '@mui/material';

import { BACKEND_SERVERS, getBaseUrl } from 'api';
import { Icon } from 'components/Icon';
import { StyledSmallTitle } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';

import {
  StyledAdvancedSettings,
  StyledFormControl,
  StyledSelect,
  StyledSettingsButton,
} from './AdvancedSettings.styles';

export const AdvancedSettings = () => {
  const { t } = useTranslation('app');
  const [selectValue, setSelectValue] = useState(getBaseUrl());
  const [showSettings, setShowSettings] = useState(false);

  const handleServerChange = ({ target: { value } }: SelectChangeEvent<unknown>) => {
    setSelectValue(value as string);
    sessionStorage.setItem('apiUrl', value as string);
  };

  return (
    <StyledAdvancedSettings>
      <StyledSettingsButton
        onClick={() => setShowSettings((prevState) => !prevState)}
        endIcon={
          showSettings ? (
            <Icon.DropdownUp color={variables.palette.primary50} />
          ) : (
            <Icon.Dropdown color={variables.palette.primary50} />
          )
        }
      >
        {t('advancedSettings')}
      </StyledSettingsButton>
      {showSettings && (
        <>
          <StyledSmallTitle color={variables.palette.shades100_alfa50}>
            {t('serverThatHoldAppletConfiguration')}
          </StyledSmallTitle>
          <StyledFormControl fullWidth>
            <InputLabel id="select-label">{t('serverUrl')}</InputLabel>
            <StyledSelect
              labelId="select-label"
              label={t('serverUrl')}
              value={selectValue}
              onChange={handleServerChange}
            >
              {BACKEND_SERVERS.map((server, index) => (
                <MenuItem key={index} value={server.value}>
                  {server.name}
                </MenuItem>
              ))}
            </StyledSelect>
          </StyledFormControl>
        </>
      )}
    </StyledAdvancedSettings>
  );
};
