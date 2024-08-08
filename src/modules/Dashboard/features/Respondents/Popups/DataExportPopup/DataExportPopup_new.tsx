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
import { sendLogFile } from 'shared/utils';
import { useSetupEnterAppletPassword } from 'shared/hooks';
import { getExportDataApi } from 'api';
import { getExportPageAmount } from 'modules/Dashboard/api/api.utils';
import { DateFormats } from 'shared/consts';
import { ExportDataFormValues } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.types';

import { DataExportPopupProps, ExecuteAllPagesOfExportData, Modals } from './DataExportPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';
import { useCheckIfHasEncryption } from '../Popups.hooks';
import { ChosenAppletData } from '../../Respondents.types';
import { getFormattedToDate } from './DataExportPopup.utils';
import { useMultipleDecryptWorkers } from './DataExportPopup.hooks';
import { BUFFER_PERCENTAGE } from './DataExportPopup.const';

export const DataExportPopup = ({
  filters = {},
  popupVisible,
  isAppletSetting,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
  'data-testid': dataTestid,
}: DataExportPopupProps) => {
  const { t } = useTranslation('app');
  const { getValues } = useFormContext<ExportDataFormValues>() ?? {};
  const { appletPasswordRef, submitForm } = useSetupEnterAppletPassword();
  const [activeModal, setActiveModal] = useState(Modals.DataExport);
  const abortControllerRef = useRef<AbortController | null>(null);

  const appletId = get(chosenAppletData, isAppletSetting ? 'id' : 'appletId');
  const subjectId = isAppletSetting ? undefined : (chosenAppletData as ChosenAppletData)?.subjectId;
  const { encryption } = chosenAppletData ?? {};

  const handleExportPopupClose = useCallback(() => {
    setChosenAppletData?.(null);
    setPopupVisible(false);
  }, [setChosenAppletData, setPopupVisible]);

  const {
    dataIsExporting,
    setDataIsExporting,
    setExportDataQueue,
    dataExportingApiRef,
    limitRef,
    finishedPagesRef,
  } = useMultipleDecryptWorkers({
    handleExportPopupClose,
    appletId,
    encryption,
    filters,
  });

  const handleDataExportSubmit = async () => {
    if (dataIsExporting || dataExportingApiRef.current || !appletId) {
      return;
    }

    await executeAllPagesOfExportData({ appletId, targetSubjectIds: subjectId });
  };

  const hasEncryptionCheck = useCheckIfHasEncryption({
    isAppletSetting,
    appletData: chosenAppletData,
    callback: handleDataExportSubmit,
  });

  const showEnterPwdScreen = !!chosenAppletData && !dataIsExporting && !hasEncryptionCheck;

  const executeAllPagesOfExportData = useCallback(
    async ({ appletId, targetSubjectIds }: ExecuteAllPagesOfExportData) => {
      abortControllerRef.current = new AbortController();
      try {
        dataExportingApiRef.current = true;
        setDataIsExporting(true);

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
        const firstPageResponse = await getExportDataApi(body, abortControllerRef.current.signal);
        const { result: firstPageData, count = 0 } = firstPageResponse.data;
        const pageLimit = getExportPageAmount(count);
        setExportDataQueue([firstPageData]);

        if (pageLimit > 1) {
          limitRef.current = pageLimit;
          for (let page = 2; page <= pageLimit; page++) {
            const nextPageResponse = await getExportDataApi(
              {
                ...body,
                page,
              },
              abortControllerRef.current.signal,
            );
            const { result: nextPageData } = nextPageResponse.data;

            setExportDataQueue((prevState) =>
              prevState ? [...prevState, nextPageData] : [nextPageData],
            );
          }
        }
      } catch (e) {
        const error = e as TypeError;
        console.warn('Error while downloading export data', error);
        setActiveModal(Modals.ExportError);
        await sendLogFile({ error });
      } finally {
        dataExportingApiRef.current = false;
      }
    },
    [getValues, dataExportingApiRef, limitRef, setDataIsExporting, setExportDataQueue],
  );
  const handleRetry = () => {
    setActiveModal(Modals.DataExport);
    handleDataExportSubmit();
  };

  const percentages = Math.floor(
    (Math.max(...[finishedPagesRef.current.size, 1]) / limitRef.current) * 100,
  );
  const percentagesBuffer = Math.min(100, percentages + BUFFER_PERCENTAGE);
  const showExportPercentages = limitRef.current > 1;

  const renderDataExportContent = () => {
    if (dataIsExporting) {
      return (
        <>
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
        </>
      );
    }

    return (
      <>
        <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
          {t('selectAppletToExportRespondentsData')}
        </StyledBodyLarge>
        <AppletsSmallTable tableRows={tableRows} />
      </>
    );
  };

  useEffect(() => {
    setActiveModal(showEnterPwdScreen ? Modals.PasswordCheck : Modals.DataExport);
  }, [showEnterPwdScreen]);

  useEffect(
    () => () => {
      if (abortControllerRef.current) {
        // stop requests to the API if the component unmounts
        abortControllerRef.current.abort();
      }
    },
    [],
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
          <StyledModalWrapper>{renderDataExportContent()}</StyledModalWrapper>
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
