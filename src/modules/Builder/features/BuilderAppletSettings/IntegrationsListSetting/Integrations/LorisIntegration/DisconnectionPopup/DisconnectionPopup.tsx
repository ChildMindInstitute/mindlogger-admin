import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import { applet } from 'shared/state/Applet';
import { Modal } from 'shared/components/Modal';
import { Svg } from 'shared/components';
import { StyledModalWrapper, theme } from 'shared/styles';
import { useAppDispatch } from 'redux/store';
import { banners } from 'redux/modules';
import { IntegrationTypes } from 'shared/consts';
import { deleteIntegrationFromApi } from 'modules/Builder/api';

import { DisconnectionPopupProps, DisconnectionSteps } from './DisconnectionPopup.types';
import { getScreens } from './DisconnectionPopup.utils';

export const DisconnectionPopup = ({ open, onClose }: DisconnectionPopupProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { updateAppletData } = applet.actions;

  const { appletId } = useParams();

  const [step, setStep] = useState(DisconnectionSteps.CurrentConnectionInfo);

  const screens = useMemo(
    () =>
      getScreens({
        onClose,
        setStep,
        handleDisconnect: async () => {
          try {
            if (!appletId) {
              return;
            }

            const res = await deleteIntegrationFromApi({
              appletId,
              integration_type: IntegrationTypes.Loris,
            });

            if (res.status === 204) {
              const integrationsWithoutLoris = appletData?.integrations?.filter(
                (i) => i.integrationType !== IntegrationTypes.Loris,
              );

              const appletUpdatedData = {
                ...appletData,
                integrations: integrationsWithoutLoris,
              };

              dispatch(updateAppletData(appletUpdatedData));
              dispatch(
                banners.actions.addBanner({
                  key: 'SaveSuccessBanner',
                  bannerProps: {
                    children: t('loris.disconnectionSuccessful'),
                    'data-testid': 'loris-disconnection-success-banner',
                  },
                }),
              );
            }
          } catch (error) {
            console.error(error);
          } finally {
            onClose();
          }
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose, setStep],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <>
          <Box sx={{ mr: theme.spacing(1.2) }}>
            <Svg width={94} height={94} id="loris-integration" />
          </Box>
          {t('loris.configurationPopupTitle')}
        </>
      }
      submitBtnColor="error"
      onSubmit={screens[step].rightButtonClick}
      buttonText={screens[step].rightButtonText}
      hasLeftBtn
      onLeftBtnSubmit={screens[step].leftButtonClick}
      leftBtnText={screens[step].leftButtonText}
      height={screens[step].height}
      data-testid="loris-disconnection-popup"
    >
      <StyledModalWrapper sx={{ mt: theme.spacing(1.2) }}>
        {screens[step].content}
      </StyledModalWrapper>
    </Modal>
  );
};
