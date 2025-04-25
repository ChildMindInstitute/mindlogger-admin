import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';

import { Modal } from 'shared/components/Modal';
import { EnterAppletPassword } from 'shared/components/Password';
import {
  StyledBodyLarge,
  StyledLinearProgress,
  StyledModalWrapper,
  theme,
  variables,
} from 'shared/styles';
import { useSetupEnterAppletPassword } from 'shared/hooks';
import { ExportDataFormValues } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.types';
import { getExportPageAmount } from 'modules/Dashboard/api/api.utils';
import { DateFormats } from 'shared/consts';
import { useEncryptionStorage } from 'shared/hooks/useEncryptionStorage';

import { DataExportPopupProps, ExecuteAllPagesOfExportData, Modals } from './DataExportPopup.types';
import { useCheckIfHasEncryption } from '../Popups.hooks';
import { ChosenAppletData } from '../../Respondents.types';
import { useMultipleDecryptWorkers } from './DataExportPopup.hooks';
import { BUFFER_PERCENTAGE } from './DataExportPopup.const';
import { ExportDataFetchService as ExportDataFetchServiceClass } from './ExportDataFetchSevice';
import { getFormattedToDate } from './DataExportPopup.utils';

export const DataExportPopup = ({
  filters = {},
  popupVisible,
  isAppletSetting,
  setPopupVisible,
  chosenAppletData,
  handlePopupClose: providedCloseHandler,
  'data-testid': dataTestid,
}: DataExportPopupProps) => {
  const { t } = useTranslation('app');
  const { getValues } = useFormContext<ExportDataFormValues>() ?? {};
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();
  const [activeModal, setActiveModal] = useState(Modals.DataExport);
  const appletId = get(chosenAppletData, isAppletSetting ? 'id' : 'appletId');
  const subjectId = isAppletSetting ? undefined : (chosenAppletData as ChosenAppletData)?.subjectId;
  const { encryption } = chosenAppletData ?? {};
  const { getAppletPrivateKey } = useEncryptionStorage();
  const privateKeyRef = useRef<null | number[]>(null);

  const handleExportPopupClose = useCallback(
    () => providedCloseHandler?.(),
    [providedCloseHandler],
  );

  const { dataIsExporting, setDataIsExporting, setExportDataQueue, limitRef, finishedPagesRef } =
    useMultipleDecryptWorkers({
      handleExportPopupClose,
      appletId,
      encryption,
      filters,
      privateKeyRef,
    });

  const ExportDataFetchService = useRef(new ExportDataFetchServiceClass()).current;

  const executeAllPagesOfExportData = async ({
    appletId,
    targetSubjectIds,
  }: ExecuteAllPagesOfExportData) => {
    try {
      setDataIsExporting(true);
      privateKeyRef.current = getAppletPrivateKey(appletId) as number[];

      const dateType = getValues?.().dateType;
      const formFromDate = getValues?.().fromDate;
      const fromDate = formFromDate && format(formFromDate, DateFormats.shortISO);
      const formToDate = getValues?.().toDate;
      const toDate = getFormattedToDate({ dateType, formToDate });

      const body = {
        appletId,
        targetSubjectIds,
        fromDate,
        toDate,
      };
      const firstPageResponse = await ExportDataFetchService.executeExport(body);
      const { result: firstPageData, count = 0 } = firstPageResponse.data;
      const pageLimit = getExportPageAmount(count);
      setExportDataQueue([firstPageData]);

      if (pageLimit > 1) {
        limitRef.current = pageLimit;
        for (let page = 2; page <= pageLimit; page++) {
          const nextPageResponse = await ExportDataFetchService.executeExport({
            ...body,
            page,
          });
          const { result: nextPageData } = nextPageResponse.data;

          setExportDataQueue((prevState) =>
            prevState ? [...prevState, nextPageData] : [nextPageData],
          );
        }
      }
    } catch {
      setActiveModal(Modals.ExportError);
    }
  };

  const handleDataExportSubmit = async () => {
    if (dataIsExporting || !appletId) {
      return;
    }

    await executeAllPagesOfExportData({
      appletId,
      targetSubjectIds: subjectId,
    });
  };

  const hasEncryptionCheck = useCheckIfHasEncryption({
    isAppletSetting,
    appletData: chosenAppletData,
    callback: handleDataExportSubmit,
  });

  const showEnterPwdScreen = !!chosenAppletData && !dataIsExporting && !hasEncryptionCheck;
  const handleRetry = () => {
    setActiveModal(Modals.DataExport);
    handleDataExportSubmit();
  };

  const percentages = Math.floor(
    (Math.max(...[finishedPagesRef.current.size, 1]) / limitRef.current) * 100,
  );
  const percentagesBuffer = Math.min(100, percentages + BUFFER_PERCENTAGE);
  const showExportPercentages = limitRef.current > 1;

  useEffect(() => {
    setActiveModal(showEnterPwdScreen ? Modals.PasswordCheck : Modals.DataExport);
  }, [showEnterPwdScreen]);

  useEffect(
    () => () => {
      if (!ExportDataFetchService) return;

      ExportDataFetchService.cancelExport();
    },
    [ExportDataFetchService],
  );

  switch (activeModal) {
    case Modals.DataExport:
      return (
        <Modal
          open={popupVisible}
          onClose={handleExportPopupClose}
          title={t('dataExport')}
          buttonText=""
          data-testid={dataTestid}
        >
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('waitForRespondentDataDownload')}
              {showExportPercentages && (
                <>
                  <br />
                  <br />
                  {t('dataProcessing', {
                    percentages,
                  })}
                </>
              )}
            </StyledBodyLarge>
            <StyledLinearProgress
              variant={showExportPercentages ? 'buffer' : 'indeterminate'}
              value={percentages}
              valueBuffer={percentagesBuffer}
            />
          </StyledModalWrapper>
        </Modal>
      );
    case Modals.PasswordCheck:
      return (
        <Modal
          open={popupVisible}
          onClose={handleExportPopupClose}
          onSubmit={submitForm}
          title={t('enterAppletPassword')}
          buttonText={t('submit')}
          data-testid={`${dataTestid}-password`}
        >
          <StyledModalWrapper>
            <EnterAppletPassword
              ref={appletPasswordRef}
              appletId={appletId ?? ''}
              encryption={encryption}
              submitCallback={handleDataExportSubmit}
              data-testid={`${dataTestid}-enter-password`}
            />
          </StyledModalWrapper>
        </Modal>
      );
    case Modals.ExportError:
      return (
        <Modal
          open={popupVisible}
          onClose={handleExportPopupClose}
          onSubmit={handleRetry}
          title={t('dataExport')}
          buttonText={t('retry')}
          hasSecondBtn
          submitBtnColor="error"
          secondBtnText={t('cancel')}
          onSecondBtnSubmit={handleExportPopupClose}
          data-testid={`${dataTestid}-error`}
        >
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ color: variables.palette.semantic.error }}>
              {t('exportFailed')}
            </StyledBodyLarge>
          </StyledModalWrapper>
        </Modal>
      );
  }
};
