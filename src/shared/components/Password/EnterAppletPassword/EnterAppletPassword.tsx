import { forwardRef, useImperativeHandle, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InputController } from 'shared/components/FormComponents/InputController';
import { Svg } from 'shared/components/Svg';
import { useEncryptionStorage } from 'shared/hooks/useEncryptionStorage';
import { StyledIconButton } from 'shared/styles/styledComponents/Buttons';
import { theme } from 'shared/styles/theme';
import { getAppletEncryptionInfo, getParsedEncryptionFromServer } from 'shared/utils/encryption';
import { Mixpanel } from 'shared/utils/mixpanel';

import { StyledController } from '../Password.styles';
import { AppletPasswordRef } from '../Password.types';
import { passwordFormSchema } from './EnterAppletPassword.schema';
import { EnterAppletPasswordForm, EnterAppletPasswordProps } from './EnterAppletPassword.types';

export const EnterAppletPassword = forwardRef<AppletPasswordRef, EnterAppletPasswordProps>(
  ({ appletId, encryption, submitCallback, 'data-testid': dataTestid }, ref) => {
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
      const encryptionInfoGenerated = await getAppletEncryptionInfo({
        appletPassword,
        ...restEncryption,
      });

      if (
        encryptionInfoGenerated
          .getPublicKey()
          .equals(Buffer.from(publicKeyFromServer as unknown as WithImplicitCoercion<string>))
      ) {
        encryptionInfoGenerated?.getPrivateKey &&
          setAppletPrivateKey(appletId, Array.from(encryptionInfoGenerated.getPrivateKey()));
        submitCallback();

        Mixpanel.track('Password added successfully');
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
      <form onSubmit={handleSubmit(submitForm)} noValidate aria-label={`${dataTestid}-form`}>
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
                <StyledIconButton
                  aria-label="toggle password visibility"
                  sx={{ p: theme.spacing(0.9) }}
                  onClick={() => setShowPassword((prevState) => !prevState)}>
                  <Svg id={showPassword ? 'visibility-off' : 'visibility-on'} />
                </StyledIconButton>
              ),
              inputProps: {
                'data-testid': `${dataTestid}-input`,
              },
            }}
            data-testid={`${dataTestid}-password`}
          />
        </StyledController>
      </form>
    );
  },
);
