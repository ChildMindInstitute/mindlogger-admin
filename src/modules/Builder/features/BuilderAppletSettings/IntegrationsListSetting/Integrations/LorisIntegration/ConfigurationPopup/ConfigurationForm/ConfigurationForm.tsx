import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledClearedButton } from 'shared/styles';
import { toggleBooleanState } from 'shared/utils';

import { StyledController } from './ConfigurationForm.styles';

export const ConfigurationForm = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <StyledController>
        <InputController
          fullWidth
          name="hostname"
          control={control}
          label={t('loris.serverHostname')}
        />
      </StyledController>
      <StyledController>
        <InputController fullWidth name="username" control={control} label={t('loris.username')} />
      </StyledController>
      <StyledController>
        <InputController
          fullWidth
          name="password"
          control={control}
          label={t('loris.password')}
          type={isPasswordVisible ? 'text' : 'password'}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <StyledClearedButton
                aria-label="toggle password visibility"
                onClick={toggleBooleanState(setIsPasswordVisible)}
              >
                <Svg id={isPasswordVisible ? 'visibility-off' : 'visibility-on'} />
              </StyledClearedButton>
            ),
          }}
        />
      </StyledController>
    </>
  );
};
