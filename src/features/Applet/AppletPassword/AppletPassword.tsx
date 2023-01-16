import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { account, folders } from 'redux/modules';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { InputController } from 'components/FormComponents';
import { getAppletEncryptionInfo } from 'utils/encryption';
import { getAppletData } from 'utils/getAppletData';
import { Svg } from 'components';

import { AppletPasswordForm, AppletPasswordProps } from './AppletPassword.types';
import { StyledInputWrapper, StyledHint } from './AppletPassword.styles';

export const AppletPassword = ({
  appletId,
  setDisabledSubmit,
  isSubmitted,
  setIsSubmitted,
  submitCallback,
}: AppletPasswordProps) => {
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
    const { encryption } = getAppletData(appletsFoldersData, appletId);
    const encryptionInfo = getAppletEncryptionInfo({
      appletPassword,
      accountId: accData?.account.accountId || '',
      prime: encryption?.appletPrime || [],
      baseNumber: encryption?.base || [],
    });

    if (
      encryptionInfo
        .getPublicKey()
        .equals(Buffer.from(encryption?.appletPublicKey as unknown as WithImplicitCoercion<string>))
    ) {
      submitCallback && submitCallback();
    } else {
      setErrorText(t('incorrectAppletPassword') as string);
      setIsSubmitted(false);
    }
  };

  useEffect(() => setDisabledSubmit && setDisabledSubmit(handleTestPwd(password)), [password]);

  useEffect(() => {
    if (isSubmitted) {
      handleSubmit(submitForm)();
    }
  }, [isSubmitted]);

  return (
    <form>
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
};
