import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { auth, folders } from 'redux/modules';
import { StyledClearedButton } from 'shared/styles/styledComponents';
import { InputController } from 'shared/components/FormComponents';
import { getAppletEncryptionInfo } from 'shared/utils/encryption';
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
    const { setEncryptionCheck } = useEncryptionCheckFromStorage();
    const { handleSubmit, control, setError } = useForm<EnterAppletPasswordForm>({
      resolver: yupResolver(passwordFormSchema()),
      defaultValues: { appletPassword: '' },
    });
    const [showPassword, setShowPassword] = useState(false);
    const userData = auth.useData();
    const { id: accountId = '' } = userData?.user || {};

    const submitForm = async ({ appletPassword }: EnterAppletPasswordForm) => {
      const encryptionInfoFromServer =
        encryption || getAppletData(appletsFoldersData, appletId).encryption;
      if (!encryptionInfoFromServer) return;

      let publicKeyFromServer = '';
      let primeFromServer = '';
      let baseFromServer = '';
      try {
        publicKeyFromServer = JSON.parse(encryptionInfoFromServer.publicKey);
        primeFromServer = JSON.parse(encryptionInfoFromServer.prime);
        baseFromServer = JSON.parse(encryptionInfoFromServer.base);
      } catch {
        return;
      }
      const encryptionInfoGenerated = getAppletEncryptionInfo({
        appletPassword,
        accountId, // TODO: should be appletData.accountId after M2-1828 will be merged
        prime: primeFromServer,
        base: baseFromServer,
      });

      if (
        encryptionInfoGenerated
          .getPublicKey()
          .equals(Buffer.from(publicKeyFromServer as unknown as WithImplicitCoercion<string>))
      ) {
        setEncryptionCheck(appletId, true);
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
