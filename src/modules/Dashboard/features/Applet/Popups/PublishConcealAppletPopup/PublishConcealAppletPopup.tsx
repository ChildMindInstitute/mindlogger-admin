import { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { publishAppletApi, concealAppletApi } from 'api';
import { applet, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Modal } from 'shared/components';
import {
  StyledModalWrapper,
  StyledLinearProgress,
  StyledBodyLarge,
  variables,
} from 'shared/styles';
import { useAsync } from 'shared/hooks';

export const PublishConcealAppletPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const { result: appletData } = applet.useAppletData() ?? {};
  const { isPublished, displayName } = appletData ?? {};
  const { appletId, publishConcealPopupVisible, popupProps } = popups.useData();

  const [isProcessPopupVisible, setProcessPopupVisible] = useState(true);
  const [isSuccessPopupVisible, setSuccessPopupVisible] = useState(false);
  const [isErrorPopupVisible, setErrorPopupVisible] = useState(false);

  const isPublishPopupRef = useRef(false);
  useEffect(() => {
    isPublishPopupRef.current = !!isPublished;
  }, [isPublished]);
  const isPublishPopup = isPublishPopupRef.current;

  const handleCloseProcessPopup = () => setProcessPopupVisible(false);
  const handlePostSuccess = () => {
    handleCloseProcessPopup();
    setSuccessPopupVisible(true);
    popupProps?.onSuccess?.();
  };
  const handlePostError = () => {
    handleCloseProcessPopup();
    setErrorPopupVisible(true);
  };

  const { execute: publishApplet, isLoading: isPublishing } = useAsync(
    publishAppletApi,
    handlePostSuccess,
    handlePostError,
  );
  const { execute: concealApplet, isLoading: isConcealing } = useAsync(
    concealAppletApi,
    handlePostSuccess,
    handlePostError,
  );

  const handleClose = () => {
    dispatch(
      popups.actions.setPopupVisible({
        appletId: '',
        key: 'publishConcealPopupVisible',
        value: false,
        popupProps: undefined,
      }),
    );
  };
  const handleSubmit = () => (isPublishPopup ? concealApplet : publishApplet)({ appletId });
  const handleRetry = () => {
    setErrorPopupVisible(false);

    handleSubmit();
  };

  return (
    <>
      {publishConcealPopupVisible && isProcessPopupVisible && (
        <Modal
          open={publishConcealPopupVisible && isProcessPopupVisible}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onSecondBtnSubmit={handleClose}
          title={t(isPublishPopup ? 'concealAppletPopupTitle' : 'publishAppletPopupTitle')}
          buttonText={t('yes')}
          secondBtnText={t('cancel')}
          hasSecondBtn
        >
          <StyledModalWrapper>
            {isConcealing || isPublishing ? (
              <StyledLinearProgress />
            ) : (
              <StyledBodyLarge>
                {t(
                  isPublishing ? 'concealAppletPopupDescription' : 'publishAppletPopupDescription',
                )}
              </StyledBodyLarge>
            )}
          </StyledModalWrapper>
        </Modal>
      )}
      {isSuccessPopupVisible && (
        <Modal
          open={isSuccessPopupVisible}
          onClose={handleClose}
          onSubmit={handleClose}
          title={t(isPublishPopup ? 'concealAppletPopupTitle' : 'publishAppletPopupTitle')}
          buttonText={t('ok')}
        >
          <StyledModalWrapper>
            <StyledBodyLarge>
              <Trans i18nKey="publishAppletPopupSuccessDescription">
                The Applet
                <strong>
                  {' '}
                  <>{{ name: displayName }}</>{' '}
                </strong>
                has been
                <> {{ status: t(isPublishPopup ? 'concealed' : 'published') }}</> successfully.
              </Trans>
            </StyledBodyLarge>
          </StyledModalWrapper>
        </Modal>
      )}
      {isErrorPopupVisible && (
        <Modal
          open={isErrorPopupVisible}
          onClose={handleClose}
          onSubmit={handleRetry}
          onSecondBtnSubmit={handleClose}
          title={t(isPublishPopup ? 'concealAppletPopupTitle' : 'publishAppletPopupTitle')}
          buttonText={t('retry')}
          secondBtnText={t('cancel')}
          hasSecondBtn
        >
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
              <Trans i18nKey="publishAppletPopupErrorDescription">
                The Applet
                <strong>
                  {' '}
                  <>{{ name: displayName }}</>{' '}
                </strong>
                has been
                <> {{ status: isPublishPopup ? 'concealed' : 'published' }}</> successfully.
              </Trans>
            </StyledBodyLarge>
          </StyledModalWrapper>
        </Modal>
      )}
    </>
  );
};
