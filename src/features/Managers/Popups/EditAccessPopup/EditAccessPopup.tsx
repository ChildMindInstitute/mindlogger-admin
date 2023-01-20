import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from 'components';
import theme from 'styles/theme';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';

import { Applet } from './Applet';
import { EditAccessPopupProps, Applet as AppletType, Role } from './EditAccessPopup.types';
import { applets as mockedApplets } from './EditAccessPopup.const';
import { StyledApplets } from './EditAccessPopup.styles';
import { getRoleIcon } from './EditAccessPopup.utils';

export const EditAccessPopup = ({
  onClose,
  editAccessPopupVisible,
  user,
}: EditAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { firstName, lastName, email } = user;
  const [applets, setApplets] = useState<AppletType[]>(mockedApplets);

  const updateRolesHandler = (id: string, callback: (roles: Role[]) => Role[]) => {
    const updatedApplets = applets.map((applet) =>
      applet.id === id
        ? {
            ...applet,
            roles: callback(applet.roles),
          }
        : { ...applet },
    );
    setApplets(updatedApplets);
  };

  const handleRemove = (id: string, label: string) => {
    updateRolesHandler(id, (roles) => roles.filter((role) => role.label !== label));
  };

  const handleAdd = (id: string, label: string) => {
    updateRolesHandler(id, (roles) => [...roles, { label, icon: getRoleIcon(label) }]);
  };

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
          {applets.map((applet) => (
            <Applet
              key={applet.id}
              addRole={handleAdd}
              removeRole={handleRemove}
              applet={applet}
              user={user}
            />
          ))}
        </StyledApplets>
      </>
    </Modal>
  );
};
