import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { StyledClearedButton } from 'shared/styles/styledComponents';
import { InputController } from 'shared/components/FormComponents';
import { getAppletEncryptionInfo, getParsedEncryptionFromServer } from 'shared/utils/encryption';
import { Svg, EnterAppletPasswordForm, EnterAppletPasswordProps } from 'shared/components';
import { useEncryptionStorage } from 'shared/hooks';

import { StyledController } from '../Password.styles';
import { passwordFormSchema } from './EnterAppletPassword.schema';
import { AppletPasswordRef } from '../Password.types';

export const EnterAppletPassword = forwardRef<AppletPasswordRef, EnterAppletPasswordProps>(
  ({ appletId, encryption, submitCallback }, ref) => {
    const { t } = useTranslation('app');
    const { setAppletPrivateKey } = useEncryptionStorage();
    const { handleSubmit, control, setError, watch } = useForm<EnterAppletPasswordForm>({
      resolver: yupResolver(passwordFormSchema()),
      defaultValues: { appletPassword: '' },
    });
    const [showPassword, setShowPassword] = useState(false);

    const submitForm = async ({ appletPassword }: EnterAppletPasswordForm) => {
      const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);
      if (!encryptionInfoFromServer) return;

      const { publicKey: publicKeyFromServer, ...restEncryption } = encryptionInfoFromServer;
      const encryptionInfoGenerated = getAppletEncryptionInfo({
        appletPassword,
        ...restEncryption,
      });

      if (
        encryptionInfoGenerated
          .getPublicKey()
          .equals(Buffer.from(publicKeyFromServer as unknown as WithImplicitCoercion<string>))
      ) {
        setAppletPrivateKey(appletId, Array.from(encryptionInfoGenerated.getPrivateKey()));
        submitCallback();
      } else {
        setError('appletPassword', { message: t('incorrectAppletPassword') });
      }
    };

    useImperativeHandle(ref, () => ({
      password: watch('appletPassword'),
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
        </StyledController>
      </form>
    );
  },
);
