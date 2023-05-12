import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { folders } from 'redux/modules';
import { StyledClearedButton } from 'shared/styles/styledComponents';
import { InputController } from 'shared/components/FormComponents';
import { getAppletEncryptionInfo, getParsedEncryptionFromServer } from 'shared/utils/encryption';
import { getAppletData } from 'shared/utils/getAppletData';
import { Svg, EnterAppletPasswordForm, EnterAppletPasswordProps } from 'shared/components';
import { useEncryptionCheckFromStorage } from 'shared/hooks';

import { StyledController } from '../Password.styles';
import { passwordFormSchema } from './EnterAppletPassword.schema';
import { AppletPasswordRef } from '../Password.types';

export const EnterAppletPassword = forwardRef<AppletPasswordRef, EnterAppletPasswordProps>(
  ({ appletId, encryption, submitCallback }, ref) => {
    const { t } = useTranslation('app');
    const appletsFoldersData = folders.useFlattenFoldersApplets();
    const { setAppletPrivateKey } = useEncryptionCheckFromStorage();
    const { handleSubmit, control, setError } = useForm<EnterAppletPasswordForm>({
      resolver: yupResolver(passwordFormSchema()),
      defaultValues: { appletPassword: '' },
    });
    const [showPassword, setShowPassword] = useState(false);

    const submitForm = async ({ appletPassword }: EnterAppletPasswordForm) => {
      const encryptionInfoFromServer = getParsedEncryptionFromServer(
        encryption! || getAppletData(appletsFoldersData, appletId).encryption!,
      );
      if (!encryptionInfoFromServer) return;

      const {
        publicKey: publicKeyFromServer,
        prime: primeFromServer,
        base: baseFromServer,
        accountId: accountIdFromServer,
      } = encryptionInfoFromServer;
      const encryptionInfoGenerated = getAppletEncryptionInfo({
        appletPassword,
        accountId: accountIdFromServer,
        prime: primeFromServer,
        base: baseFromServer,
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
