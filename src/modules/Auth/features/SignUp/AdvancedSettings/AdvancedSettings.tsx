import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterOptionsState, TextField, Autocomplete } from '@mui/material';

import { BACKEND_SERVERS, getBaseUrl, ServerUrlOption } from 'api';
import { StyledLabelSmall } from 'shared/styles/styledComponents';
import { Svg } from 'shared/components/Svg';
import { variables } from 'shared/styles/variables';
import { LocalStorageKeys, storage } from 'shared/utils';

import {
  StyledAdvancedSettings,
  StyledFormControl,
  StyledMenuItem,
  StyledSettingsButton,
} from './AdvancedSettings.styles';

export const AdvancedSettings = () => {
  const { t } = useTranslation('app');
  const [selectValue, setSelectValue] = useState<string | ServerUrlOption>(getBaseUrl());
  const [showSettings, setShowSettings] = useState(false);

  const handleServerChange = (e: React.SyntheticEvent, selectedValue: string | ServerUrlOption) => {
    storage.setItem(LocalStorageKeys.ApiUrl, typeof selectedValue === 'string' ? selectedValue : selectedValue.value);
    setSelectValue(selectedValue);
  };

  const handleFilterOptions = (options: ServerUrlOption[], params: FilterOptionsState<ServerUrlOption>) => {
    const { inputValue } = params;
    const filtered = options.filter(option => option.name.includes(inputValue));
    const isExisting = options.some(option => inputValue === option.value);
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        value: inputValue,
        name: `${inputValue}`,
      });
    }

    return filtered;
  };

  return (
    <StyledAdvancedSettings>
      <StyledSettingsButton
        onClick={() => setShowSettings(prevState => !prevState)}
        endIcon={showSettings ? <Svg id="dropdown-up" /> : <Svg id="dropdown" />}>
        {t('advancedSettings')}
      </StyledSettingsButton>
      {showSettings && (
        <>
          <StyledLabelSmall color={variables.palette.outline}>
            {t('serverThatHoldAppletConfiguration')}
          </StyledLabelSmall>
          <StyledFormControl fullWidth>
            <Autocomplete
              value={selectValue}
              onChange={handleServerChange}
              filterOptions={handleFilterOptions}
              selectOnFocus
              disableClearable
              clearOnBlur
              options={BACKEND_SERVERS}
              getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
              renderOption={(props, option) => <StyledMenuItem {...props}>{option.name}</StyledMenuItem>}
              renderInput={({ InputLabelProps, ...params }) => <TextField {...params} label={t('serverUrl')} />}
              freeSolo
            />
          </StyledFormControl>
        </>
      )}
    </StyledAdvancedSettings>
  );
};
