import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { account, folders } from 'redux/modules';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { InputController } from 'components/FormComponents';
import { getAppletEncryptionInfo } from 'utils/encryption';
import { getAppletData } from 'utils/getAppletData';
import { Svg } from 'components';

import { AppletPasswordForm, AppletPasswordProps, AppletPasswordRef } from './AppletPassword.types';
import { StyledInputWrapper, StyledHint } from './AppletPassword.styles';

export const AppletPassword = forwardRef<AppletPasswordRef, AppletPasswordProps>(
  ({ appletId, encryption, setDisabledSubmit, submitCallback }, ref) => {
    const { t } = useTranslation('app');
    const accData = account.useData();
    const appletsFoldersData = folders.useFlattenFoldersApplets();

    const { handleSubmit, control, watch } = useForm<AppletPasswordForm>({
      defaultValues: { appletPassword: '' },
    });
    const password = watch('appletPassword');

    const [showPassword, setShowPassword] = useState(false);
    const [errorText, setErrorText] = useState('');

    const handleTestPwd = (pwdValue: string): boolean => {
      const appletPwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*])(?=.{8,})/;

      return !appletPwdPattern.test(pwdValue);
    };

    const submitForm = ({ appletPassword }: AppletPasswordForm) => {
      if (!(appletId || encryption)) {
        return submitCallback && submitCallback({ appletPassword });
      }

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
        submitCallback && submitCallback();
      } else {
        setErrorText(t('incorrectAppletPassword') as string);
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(submitForm)();
      },
    }));

    useEffect(() => setDisabledSubmit && setDisabledSubmit(handleTestPwd(password)), [password]);

    return (
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <StyledInputWrapper>
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
          <StyledHint isError={!!errorText}>{errorText || t('enterAppletPasswordHint')}</StyledHint>
        </StyledInputWrapper>
      </form>
    );
  },
);
