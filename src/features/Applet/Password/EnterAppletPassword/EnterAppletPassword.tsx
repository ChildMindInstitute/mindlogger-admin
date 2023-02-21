import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { account, folders } from 'redux/modules';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { InputController } from 'components/FormComponents';
import { getAppletEncryptionInfo } from 'utils/encryption';
import { getAppletData } from 'utils/getAppletData';
import { Svg } from 'components';

import {
  AppletPasswordForm,
  AppletPasswordProps,
  AppletPasswordRef,
} from './EnterAppletPassword.types';
import { StyledController, StyledHint } from '../Password.styles';
import { passwordFormSchema } from './EnterAppletPassword.schema';

export const EnterAppletPassword = forwardRef<AppletPasswordRef, AppletPasswordProps>(
  ({ appletId, encryption, submitCallback }, ref) => {
    const { t } = useTranslation('app');
    const accData = account.useData();
    const appletsFoldersData = folders.useFlattenFoldersApplets();

    const { handleSubmit, control, setError } = useForm<AppletPasswordForm>({
      resolver: yupResolver(passwordFormSchema()),
      defaultValues: { appletPassword: '' },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorText, setErrorText] = useState('');

    const submitForm = ({ appletPassword }: AppletPasswordForm) => {
      const appletEncryption = encryption || getAppletData(appletsFoldersData, appletId).encryption;
      const encryptionInfo = getAppletEncryptionInfo({
        appletPassword,
        accountId: accData?.account.accountId || '',
        prime: appletEncryption?.appletPrime || [],
        baseNumber: appletEncryption?.base || [],
      });

      if (
        encryptionInfo
          .getPublicKey()
          .equals(
            Buffer.from(
              appletEncryption?.appletPublicKey as unknown as WithImplicitCoercion<string>,
            ),
          )
      ) {
        setErrorText('');
        submitCallback && submitCallback();
      } else {
        setError('appletPassword', { message: t('incorrectAppletPassword') });
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(submitForm)();
      },
    }));

    return (
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <StyledController>
          <InputController
            fullWidth
            name="appletPassword"
            control={control}
            label={t('password')}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <StyledClearedButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                >
                  <Svg id={showPassword ? 'visibility-off' : 'visibility-on'} />
                </StyledClearedButton>
              ),
            }}
          />
          <StyledHint isError={!!errorText}>{errorText}</StyledHint>
        </StyledController>
      </form>
    );
  },
);
