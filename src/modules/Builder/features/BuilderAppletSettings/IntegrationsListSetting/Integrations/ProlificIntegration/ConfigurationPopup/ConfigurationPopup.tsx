import { Box } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal, Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledBodyMedium, StyledModalWrapper, theme, variables } from 'shared/styles';

import { StyledLink } from '../ProlificIntegration.styles';
import { saveProlificApiToken } from '../ProlificIntegration.utils';
import type { ConfigurationPopup as ConfigurationPopupProps } from './ConfigurationPopup.types';

type ProlificApiToken = {
  apiToken: string;
};

export const ConfigurationPopup = ({
  open,
  onClose,
  onApiTokenSubmitted,
}: ConfigurationPopupProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [apiTokenExists, setApiTokenExists] = useState(false);

  const inputNameApiToken = 'apiToken';

  const methods = useForm<ProlificApiToken>({
    defaultValues: {
      apiToken: '',
    },
  });

  const submitProlificApiToken = async () => {
    setSubmitting(true);

    try {
      await saveProlificApiToken(methods.getValues().apiToken);
      setError(undefined);
      setApiTokenExists(true);
      onApiTokenSubmitted(true);
    } catch (e) {
      setError('Error saving Prolific API token');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedirect = () => {};

  return (
    <FormProvider {...methods}>
      <Modal
        open={open && !apiTokenExists}
        onClose={onClose}
        title={
          <>
            <Box sx={{ mr: theme.spacing(1.2) }}>
              <Svg width={90} height={90} id="prolific-integration" />
            </Box>
            {t('prolific.configurationPopupTitle')}
          </>
        }
        disabledSubmit={methods.watch(inputNameApiToken) === '' && !submitting && !apiTokenExists}
        onSubmit={methods.handleSubmit(submitProlificApiToken)}
        buttonText={t('submit')}
        hasLeftBtn
        onLeftBtnSubmit={onClose}
        leftBtnText={t('cancel')}
        data-testid="prolific-configuration-popup"
        height="60rem"
      >
        <StyledModalWrapper>
          <StyledBodyMedium sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.2) }}>
            {submitting
              ? t('prolific.configurationPopupConnecting')
              : t('prolific.configurationPopupDescription')}
          </StyledBodyMedium>
          <InputController
            name={inputNameApiToken}
            required
            disabled={apiTokenExists}
            fullWidth
            label={t('prolific.apiToken')}
            onChange={(e) => methods.setValue(inputNameApiToken, e.target.value)}
          />
          {error && (
            <StyledBodyMedium
              sx={{ color: variables.palette.semantic.error, mt: theme.spacing(1.8) }}
              data-testid="upload-data-popup-error"
            >
              {error}
            </StyledBodyMedium>
          )}

          <StyledBodyMedium sx={{ color: variables.palette.on_surface, mt: theme.spacing(1.2) }}>
            <StyledLink onClick={handleRedirect}>{t('prolific.findProlificApiToken')}</StyledLink>
          </StyledBodyMedium>
        </StyledModalWrapper>
      </Modal>
    </FormProvider>
  );
};
