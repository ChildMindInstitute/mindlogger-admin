import { Box } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal, Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { IntegrationTypes } from 'shared/consts';
import { StyledBodyMedium, StyledModalWrapper, theme, variables } from 'shared/styles';

import { StyledLink } from '../ProlificIntegration.styles';
import { createProlificIntegration } from '../ProlificIntegration.utils';
import type { PopupProps as ConfigurationPopupProps } from '../ProlificIntegration.types';
import { ConfigurationPopupState, ProlificApiToken } from './ConfigurationPopup.types';
import { StyledApiInputWithButton, StyledApiTokenButton } from './ConfigurationPopup.style';

export const ConfigurationPopup = ({
  open,
  onClose,
  applet,
  updateAppletData,
}: ConfigurationPopupProps) => {
  const { t } = useTranslation();
  const [state, setState] = useState<ConfigurationPopupState>({ kind: 'idle' });
  const [inputType, setInputType] = useState('password');

  const toggle = (inputType: string) => {
    if (inputType === 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
  };

  const inputNameApiToken = 'apiToken';

  const methods = useForm<ProlificApiToken>({
    defaultValues: {
      apiToken: '',
    },
  });

  const submitProlificApiToken = async () => {
    setState({ kind: 'submitting' });

    const apiToken = methods.getValues().apiToken;

    if (!applet?.id) {
      return;
    }

    try {
      await createProlificIntegration(apiToken, applet.id);
      const nextApplet = {
        ...applet,
        integrations: [
          ...(applet.integrations ?? []),
          {
            integrationType: IntegrationTypes.Prolific,
            configuration: {},
          },
        ],
      };

      updateAppletData(nextApplet);
      onClose();
    } catch (e) {
      if (e instanceof Error) {
        setState({ kind: 'error', message: e.message });
      }
    }
  };

  const { kind } = state;

  return (
    <FormProvider {...methods}>
      <Modal
        open={open}
        onClose={onClose}
        title={
          <>
            <Box sx={{ mr: theme.spacing(1.2) }}>
              <Svg width={90} height={90} id="prolific-integration" />
            </Box>
            {t('prolific.configurationPopupTitle')}
          </>
        }
        disabledSubmit={methods.watch(inputNameApiToken) === '' || kind === 'submitting'}
        onSubmit={methods.handleSubmit(submitProlificApiToken)}
        buttonText={t('submit')}
        hasLeftBtn
        onLeftBtnSubmit={onClose}
        leftBtnText={t('cancel')}
        data-testid="prolific-configuration-popup"
        height="60rem"
      >
        <StyledModalWrapper>
          <StyledBodyMedium
            sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.2) }}
            data-testid="prolific-description-popup"
          >
            {state.kind === 'submitting'
              ? t('prolific.configurationPopupConnecting')
              : t('prolific.configurationPopupDescription')}
          </StyledBodyMedium>
          <StyledApiInputWithButton>
            <InputController
              name={inputNameApiToken}
              required
              disabled={state.kind === 'submitting'}
              fullWidth
              label={t('prolific.apiToken')}
              type={inputType}
              autoComplete="off"
              onChange={(e) => methods.setValue(inputNameApiToken, e.target.value)}
              sx={{ '& .MuiInputBase-input': { paddingRight: '80px' } }}
            />
            {methods.watch(inputNameApiToken) !== '' && (
              <StyledApiTokenButton onClick={() => toggle(inputType)}>
                {inputType === 'password' ? t('prolific.show') : t('prolific.hide')}
              </StyledApiTokenButton>
            )}
          </StyledApiInputWithButton>
          {kind === 'error' && (
            <StyledBodyMedium
              sx={{ color: variables.palette.semantic.error, mt: theme.spacing(1.8) }}
              data-testid="prolific-upload-data-popup-error"
            >
              {state.message}
            </StyledBodyMedium>
          )}

          <StyledBodyMedium sx={{ color: variables.palette.on_surface, mt: theme.spacing(1.2) }}>
            <StyledLink href="https://docs.prolific.com/docs/api-docs/public/#tag/Introduction/Authentication">
              {t('prolific.findProlificApiToken')}
            </StyledLink>
          </StyledBodyMedium>
        </StyledModalWrapper>
      </Modal>
    </FormProvider>
  );
};
