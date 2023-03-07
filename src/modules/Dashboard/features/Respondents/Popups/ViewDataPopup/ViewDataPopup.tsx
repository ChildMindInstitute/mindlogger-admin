import { RefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { AppletPasswordRef, EnterAppletPassword } from 'modules/Dashboard/features/Applet';

import { ViewDataPopupProps } from './ViewDataPopup.types';
import { AppletsSmallTable } from '../../AppletsSmallTable';

export const ViewDataPopup = ({
  popupVisible,
  setPopupVisible,
  tableRows,
  chosenAppletData,
  setChosenAppletData,
}: ViewDataPopupProps) => {
  const { t } = useTranslation('app');
  const appletPasswordRef = useRef() as RefObject<AppletPasswordRef>;

  const submitForm = () => {
    if (appletPasswordRef?.current) {
      appletPasswordRef.current.submitForm();
    }
  };

  const showSecondScreen = !!chosenAppletData;

  const handlePopupClose = () => {
    setChosenAppletData(null);
    setPopupVisible(false);
  };

  return (
    <Modal
      open={popupVisible}
      onClose={handlePopupClose}
      onSubmit={submitForm}
      title={showSecondScreen ? t('enterAppletPassword') : t('viewData')}
      buttonText={showSecondScreen ? t('submit') : ''}
    >
      <StyledModalWrapper>
        {showSecondScreen ? (
          <EnterAppletPassword
            ref={appletPasswordRef}
            appletId={chosenAppletData.appletId}
            submitCallback={() => handlePopupClose()}
          />
        ) : (
          <>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('viewDataDescription')}
            </StyledBodyLarge>
            <AppletsSmallTable tableRows={tableRows} />
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
