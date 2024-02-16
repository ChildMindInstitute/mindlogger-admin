import { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { publishAppletApi, concealAppletApi } from 'api';
import { applet, banners, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Modal } from 'shared/components';
import {
  StyledModalWrapper,
  StyledLinearProgress,
  StyledBodyLarge,
  variables,
} from 'shared/styles';
import { useAsync } from 'shared/hooks/useAsync';

export const PublishConcealAppletPopup = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const { result: appletData } = applet.useAppletData() ?? {};
  const { publishConcealPopupVisible, popupProps } = popups.useData();

  const [isProcessPopupVisible, setProcessPopupVisible] = useState(true);
  const [isErrorPopupVisible, setErrorPopupVisible] = useState(false);

  const isPublishPopupRef = useRef(false);

  useEffect(() => {
    isPublishPopupRef.current = !!appletData?.isPublished;
  }, [appletData?.isPublished]);

  const isPublishPopup = isPublishPopupRef.current;

  const handleCloseProcessPopup = () => setProcessPopupVisible(false);

  const handlePostSuccess = () => {
    handleCloseProcessPopup();

    dispatch(
      banners.actions.addBanner({
        key: 'SaveSuccessBanner',
        bannerProps: {
          children: (
            <Trans i18nKey="publishAppletPopupSuccessDescription">
              The Applet
              <strong>
                {' '}
                <>{{ name: appletData?.displayName }}</>{' '}
              </strong>
              has been
              <> {{ status: t(appletData?.isPublished ? 'published' : 'concealed') }}</>{' '}
              successfully.
            </Trans>
          ),
          duration: null,
          'data-testid': `dashboard-applets-${
            appletData?.isPublished ? 'publish' : 'conceal'
          }-success-banner`,
        },
      }),
    );

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
  const isLoading = isConcealing || isPublishing;

  const handleClose = () => {
    !isLoading &&
      dispatch(
        popups.actions.setPopupVisible({
          applet: appletData,
          key: 'publishConcealPopupVisible',
          value: false,
          popupProps: undefined,
        }),
      );
  };
  const handleSubmit = () =>
    (isPublishPopup ? concealApplet : publishApplet)({ appletId: appletData?.id as string });
  const handleRetry = () => {
    setErrorPopupVisible(false);
    setProcessPopupVisible(true);

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
          buttonText={!isLoading ? t('yes') : ''}
          secondBtnText={t('cancel')}
          hasSecondBtn={!isLoading}
          data-testid="dashboard-applets-publish-conceal-popup"
        >
          <StyledModalWrapper>
            {isLoading ? (
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
          data-testid="dashboard-applets-publish-conceal-popup-error-popup"
        >
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
              <Trans i18nKey="publishAppletPopupErrorDescription">
                The Applet
                <strong>
                  {' '}
                  <>{{ name: appletData?.displayName }}</>{' '}
                </strong>
                has not been
                <> {{ status: isPublishPopup ? 'concealed' : 'published' }}</>. Please try again.
              </Trans>
            </StyledBodyLarge>
          </StyledModalWrapper>
        </Modal>
      )}
    </>
  );
};
