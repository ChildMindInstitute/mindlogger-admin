import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components';
import theme from 'styles/theme';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';

import { Applet } from './Applet';
import { EditAccessPopupProps, Applet as AppletType } from './EditAccessPopup.types';
import { applets as mockedApplets } from './EditAccessPopup.const';
import { StyledApplets } from './EditAccessPopup.styles';

export const EditAccessPopup = ({
  onClose,
  editAccessPopupVisible,
  user,
}: EditAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { firstName, lastName, email } = user;
  const [applets, setApplets] = useState<AppletType[]>(mockedApplets);

  return (
    <Modal
      open={editAccessPopupVisible}
      onClose={onClose}
      onSubmit={onClose}
      title={t('editAccess')}
      buttonText={t('save')}
      width="66"
    >
      <>
        <StyledModalWrapper>
          <StyledBodyLarge sx={{ margin: theme.spacing(-1.8, 0, 1.2) }}>
            <strong>
              {firstName} {lastName} ({email})
            </strong>
            {t('userHasAccess')}
          </StyledBodyLarge>
        </StyledModalWrapper>
        <StyledApplets>
          {applets.map((el, i) => (
            <Applet key={el.id} index={i} setApplets={setApplets} applets={applets} {...el} />
          ))}
        </StyledApplets>
      </>
    </Modal>
  );
};
