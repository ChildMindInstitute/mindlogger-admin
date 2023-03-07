import { RefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { AppletPasswordRef, EnterAppletPassword } from 'modules/Dashboard/features/Applet';
import theme from 'shared/styles/theme';
import {
  StyledModalWrapper,
  StyledErrorText,
  StyledBodyLarge,
} from 'shared/styles/styledComponents';
import { getUsersDataApi } from 'api';
import { useAsync } from 'shared/hooks';
import { getErrorMessage } from 'shared/utils/errors';

import { DataExportPopupProps } from './DataExportPopup.types';
import { StyledLinearProgress } from './DataExportPopup.styles';
import { AppletsSmallTable } from '../../AppletsSmallTable';

export const DataExportPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: DataExportPopupProps) => {
  const { t } = useTranslation('app');
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const appletPasswordRef = useRef() as RefObject<AppletPasswordRef>;
  const showEnterPwdScreen = !!chosenAppletData && !dataIsExporting;

  // TODO: shift to the new API when it is ready,
  //  and prepare data export CSVs with new API data
  const { execute, error } = useAsync(getUsersDataApi, (res) => {
    if (res?.data) {
      setDataIsExporting(false);
      setPopupVisible(false);
      setChosenAppletData(null);
    }
  });

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  const handleModalSubmit = () => {
    if (appletPasswordRef?.current) {
      appletPasswordRef.current.submitForm();
    }
  };

  const handleDataExportSubmit = async () => {
    setDataIsExporting(true);
    await execute({ appletId: chosenAppletData?.appletId || '' });
  };

  useEffect(() => {
    if (error) {
      setDataIsExporting(false);
    }
  }, [error]);

  let modalContent = (
    <>
      <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
        {t('selectAppletToExportRespondentsData')}
      </StyledBodyLarge>
      <AppletsSmallTable tableRows={tableRows} />
    </>
  );

  if (showEnterPwdScreen) {
    modalContent = (
      <EnterAppletPassword
        ref={appletPasswordRef}
        appletId={chosenAppletData.appletId}
        submitCallback={handleDataExportSubmit}
      />
    );
  }

  if (dataIsExporting) {
    modalContent = (
      <>
        <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
          {t('waitForRespondentDataDownload')}
        </StyledBodyLarge>
        <StyledLinearProgress />
      </>
    );
  }

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={handleModalSubmit}
      title={showEnterPwdScreen ? t('enterAppletPassword') : t('dataExport')}
      buttonText={showEnterPwdScreen ? t('submit') : ''}
    >
      <StyledModalWrapper>
        {modalContent}
        {error && (
          <StyledErrorText sx={{ marginTop: theme.spacing(1) }}>
            {getErrorMessage(error)}
          </StyledErrorText>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
