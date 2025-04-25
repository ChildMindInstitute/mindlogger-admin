import { useTranslation } from 'react-i18next';

import { ChooseAppletPopupProps } from 'modules/Dashboard/features/Respondents/Popups/ChooseAppletPopup/ChooseAppletPopup.types';
import {
  StyledBodyLarge,
  StyledBodyMedium,
  StyledFlexTopCenter,
  StyledLabelLarge,
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  theme,
} from 'shared/styles';
import { AppletsSmallTable } from 'modules/Dashboard/features/Respondents/AppletsSmallTable';
import { Modal, Row } from 'shared/components';
import { ChosenAppletData } from 'modules/Dashboard/features/index';

/**
 * A modal component to allow the user to choose from one of several applets a respondent has
 * access to
 * @param tableRows
 * @param popupVisible
 * @param handleClose
 * @param dataTestid
 * @constructor
 */
export const ChooseAppletPopup = ({
  respondentId,
  appletOwnerId,
  appletAccesses,
  popupVisible,
  setPopupVisible,
  handleClose,
  dataTestid,
}: ChooseAppletPopupProps) => {
  const { t } = useTranslation('app');

  const tableRows: Row[] = appletAccesses.map((respondentAccess) => {
    const choseAppletHandler = () => {
      const chosenApplet: ChosenAppletData = {
        ...respondentAccess,
        ownerId: appletOwnerId,
        respondentId,
        createdAt: respondentAccess.subjectCreatedAt,
      };

      setPopupVisible(false);
      handleClose(chosenApplet);
    };

    const { appletDisplayName, appletImage, respondentSecretId, respondentNickname } =
      respondentAccess;

    return {
      appletName: {
        content: () => (
          <StyledFlexTopCenter>
            {appletImage ? (
              <StyledSmallAppletImg src={appletImage} alt="Applet image" />
            ) : (
              <StyledSmallAppletImgPlaceholder />
            )}
            <StyledLabelLarge>{appletDisplayName}</StyledLabelLarge>
          </StyledFlexTopCenter>
        ),
        value: appletDisplayName,
        onClick: choseAppletHandler,
      },
      secretUserId: {
        content: () => <StyledLabelLarge>{respondentSecretId}</StyledLabelLarge>,
        value: respondentSecretId,
        onClick: choseAppletHandler,
      },
      nickname: {
        content: () => <StyledBodyMedium>{respondentNickname}</StyledBodyMedium>,
        value: respondentNickname,
        onClick: choseAppletHandler,
      },
    };
  });

  return (
    <Modal
      open={popupVisible}
      onClose={() => {
        setPopupVisible(false);
        handleClose(null);
      }}
      title={t('dataExport')}
      buttonText=""
      data-testid={`${dataTestid}-choose-applet-popup`}
    >
      <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
        {t('selectAppletToExportRespondentsData')}
      </StyledBodyLarge>
      <AppletsSmallTable tableRows={tableRows} />
    </Modal>
  );
};
