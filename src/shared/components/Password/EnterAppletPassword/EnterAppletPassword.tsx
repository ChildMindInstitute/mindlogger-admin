import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { account, folders } from 'redux/modules';
import { StyledClearedButton } from 'shared/styles/styledComponents';
import { InputController } from 'shared/components/FormComponents';
import { getAppletEncryptionInfo } from 'shared/utils/encryption';
import { getAppletData } from 'shared/utils/getAppletData';
import { Svg, EnterAppletPasswordForm, EnterAppletPasswordProps } from 'shared/components';
import { useAsync, usePasswordFromStorage } from 'shared/hooks';
import { postAppletPasswordCheckApi } from 'shared/api';

import { StyledController } from '../Password.styles';
import { passwordFormSchema } from './EnterAppletPassword.schema';
import { AppletPasswordRef } from '../Password.types';

export const EnterAppletPassword = forwardRef<AppletPasswordRef, EnterAppletPasswordProps>(
  ({ appletId, encryption, submitCallback, noEncryption }, ref) => {
    const { t } = useTranslation('app');
    const accData = account.useData();
    const appletsFoldersData = folders.useFlattenFoldersApplets();
    const passwordRef = useRef<string | null>(null);
    const { setPassword } = usePasswordFromStorage();
    const { execute } = useAsync(
      postAppletPasswordCheckApi,
      () => {
        const appletPassword = passwordRef.current ?? '';
        setPassword(appletId, appletPassword);
        submitCallback && submitCallback({ appletPassword });
      },
      () => {
        setError('appletPassword', { message: t('incorrectAppletPassword') });
      },
    );

    const { handleSubmit, control, setError } = useForm<EnterAppletPasswordForm>({
      resolver: yupResolver(passwordFormSchema()),
      defaultValues: { appletPassword: '' },
    });

    const [showPassword, setShowPassword] = useState(false);

    const submitForm = async ({ appletPassword }: EnterAppletPasswordForm) => {
      if (noEncryption && appletId) {
        passwordRef.current = appletPassword;
        await execute({ appletId, password: appletPassword });

        return;
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
        submitCallback && submitCallback({ appletPassword });
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
