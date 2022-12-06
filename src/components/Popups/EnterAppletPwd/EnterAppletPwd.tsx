import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components/Popups';
import { Svg } from 'components/Svg';
import { InputController } from 'components/FormComponents';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

import { EnterAppletPwdProps, AppletPwd } from './EnterAppletPwd.types';
import { StyledInputWrapper, StyledHint } from './EnterAppletPwd.styles';

export const EnterAppletPwd = ({ open, onClose, onSubmit }: EnterAppletPwdProps) => {
  const { t } = useTranslation('app');
  const [showPwd, setShowPwd] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const { handleSubmit, control, watch } = useForm<AppletPwd>({
    defaultValues: { password: '' },
  });

  const password = watch('password');
  const handleTestPwd = (pwdValue: string): boolean => {
    const appletPwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*])(?=.{8,})/;

    return !appletPwdPattern.test(pwdValue);
  };

  useEffect(() => setDisabledSubmit(handleTestPwd(password)), [password]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title={t('enterAppletPassword')}
      buttonText={t('submit')}
      disabledSubmit={disabledSubmit}
    >
      <StyledInputWrapper>
        <InputController
          fullWidth
          name="password"
          control={control}
          label={t('password')}
          type={showPwd ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <StyledClearedButton
                aria-label="toggle password visibility"
                onClick={() => setShowPwd((prevState) => !prevState)}
              >
                {showPwd ? <Svg id="visibility-off" /> : <Svg id="visibility-on" />}
              </StyledClearedButton>
            ),
          }}
        />
        <StyledHint>{t('enterAppletPasswordHint')}</StyledHint>
      </StyledInputWrapper>
    </Modal>
  );
};
