import { Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Svg } from 'shared/components';
import { IntegrationTypes } from 'shared/consts';
import {
  StyledBodyLarger,
  StyledBodyMedium,
  StyledFlexAllCenter,
  StyledModalWrapper,
  theme,
  variables,
} from 'shared/styles';

import { deleteProlificIntegration } from '../ProlificIntegration.utils';
import { PopupProps as DisconnectionPopupProps } from '../ProlificIntegration.types';
import { DisconnectionPopupState } from './DisconnectionPopup.types';

export const DisconnectionPopup = ({
  open,
  onClose,
  applet,
  updateAppletData,
}: DisconnectionPopupProps) => {
  const { t } = useTranslation();
  const [state, setState] = useState<DisconnectionPopupState>({ kind: 'idle' });

  const deleteProlificApiToken = async () => {
    if (!applet.id) return;

    setState({ kind: 'deleting' });
    try {
      await deleteProlificIntegration(applet.id);
      const nextApplet = {
        ...applet,
        integrations:
          applet.integrations?.filter(
            (integration) => integration.integrationType !== IntegrationTypes.Prolific,
          ) ?? [],
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
    <Modal
      open={open}
      onClose={onClose}
      title={
        <>
          <Box sx={{ mr: theme.spacing(1.2) }}>
            <Svg width={90} height={90} id="prolific-integration" />
          </Box>
          {t('prolific.disconnect')}
        </>
      }
      disabledSubmit={kind === 'deleting'}
      submitBtnColor="error"
      onSubmit={deleteProlificApiToken}
      buttonText={kind === 'deleting' ? t('prolific.deleting') : t('prolific.delete')}
      hasLeftBtn
      onLeftBtnSubmit={onClose}
      leftBtnText={t('cancel')}
      data-testid="prolific-disconnect-popup"
      height="35rem"
    >
      <StyledModalWrapper>
        <StyledFlexAllCenter>
          <StyledBodyLarger
            sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.2) }}
            data-testid="prolific-deletion-warning"
          >
            {t('prolific.deletionWarning')}
          </StyledBodyLarger>
        </StyledFlexAllCenter>
        {kind === 'error' && (
          <StyledBodyMedium
            sx={{ color: variables.palette.semantic.error, mt: theme.spacing(1.8) }}
          >
            {state.message}
          </StyledBodyMedium>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
