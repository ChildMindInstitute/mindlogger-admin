import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { banners } from 'redux/modules';
import { Modal } from 'shared/components';
import { StyledLinearProgress, StyledModalWrapper, theme, variables } from 'shared/styles';
import { concatIf } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { useAppletDataFromForm } from 'modules/Builder/features/SaveAndPublish/SaveAndPublish.hooks';
import { reportConfig } from 'modules/Builder/state';

import {
  SaveAndPublishProcessPopupProps,
  SaveAndPublishSteps,
} from './SaveAndPublishProcessPopup.types';
import { Description } from './Description';
import { saveAndPublishProcessTestIds } from './SaveAndPublishProcessPopup.const';

export const SaveAndPublishProcessPopup = ({
  isPopupVisible,
  step,
  onRetry,
  onClose,
}: SaveAndPublishProcessPopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const getAppletData = useAppletDataFromForm();
  const name = getAppletData()?.displayName;

  const { setReportConfigChanges } = reportConfig.actions;

  const handleReportConfigSave = async () => {
    await dispatch(setReportConfigChanges({ saveChanges: true }));
    onClose();
  };
  const handleReportConfigDoNotSave = async () => {
    await dispatch(setReportConfigChanges({ doNotSaveChanges: true }));
    onClose();
  };

  useEffect(() => {
    // Show a success banner if the applet successfully saves.
    //
    // This would ideally be called in a callback somewhere in SaveAndPublish.hooks.ts
    // instead of being triggered in a useEffect, but for now, opting to put it here
    // to keep all of the success UI in the same place.
    if (isPopupVisible && step === SaveAndPublishSteps.Success) {
      // If there is any visible banner warning the user they haven't made changes,
      // remove it before showing the success banner.
      dispatch(
        banners.actions.removeBanner({
          key: 'AppletWithoutChangesBanner',
        }),
      );

      dispatch(
        banners.actions.addBanner({
          key: 'SaveSuccessBanner',
          bannerProps: {
            children: (
              <Trans i18nKey="appletSavedAndPublished">
                <>
                  Your applet
                  <strong>
                    <>{{ name }}</>
                  </strong>
                  was successfully uploaded!
                </>
              </Trans>
            ),
            'data-testid': 'dashboard-applets-save-success-banner',
          },
        }),
      );

      onClose();
    }
  }, [isPopupVisible, step]);

  if (
    !step ||
    // If the user has successfully published, we trigger a banner using the
    // dispatch above instead of rendering a modal.
    step === SaveAndPublishSteps.Success
  )
    return null;

  let modalProps = {};
  if (step === SaveAndPublishSteps.BeingCreated) {
    modalProps = {
      hasActions: false,
    };
  }
  if (step === SaveAndPublishSteps.Failed) {
    modalProps = {
      buttonText: t('retry'),
      onSubmit: onRetry,
      hasSecondBtn: true,
      secondBtnText: t('back'),
      onSecondBtnSubmit: onClose,
    };
  }
  if (step === SaveAndPublishSteps.ReportConfigSave) {
    modalProps = {
      title: t('reportConfiguration'),
      buttonText: t('save'),
      onSubmit: handleReportConfigSave,
      hasSecondBtn: true,
      secondBtnText: t('dontSave'),
      secondBtnStyles: {
        color: variables.palette.semantic.error,
        fontWeight: variables.font.weight.bold,
      },
      onSecondBtnSubmit: handleReportConfigDoNotSave,
      hasThirdBtn: true,
      thirdBtnText: t('cancel'),
      onThirdBtnSubmit: onClose,
    };
  }

  return (
    <Modal
      open={isPopupVisible}
      onClose={onClose}
      title={t('saveAndPublish')}
      buttonText={t('ok')}
      onSubmit={onClose}
      data-testid={concatIf('builder-save-and-publish-popup', saveAndPublishProcessTestIds[step])}
      {...modalProps}
    >
      <StyledModalWrapper>
        <Box
          sx={{
            mt: theme.spacing(-1),
            pb: step === SaveAndPublishSteps.BeingCreated ? theme.spacing(3.2) : 0,
          }}
        >
          <Description step={step} />
          {step === SaveAndPublishSteps.BeingCreated && (
            <StyledLinearProgress sx={{ mt: theme.spacing(3) }} />
          )}
        </Box>
      </StyledModalWrapper>
    </Modal>
  );
};
