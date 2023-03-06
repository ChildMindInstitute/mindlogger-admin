import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'components';
import theme from 'styles/theme';
import { StyledModalWrapper, StyledBodyLarge } from 'styles/styledComponents';
import { Roles } from 'consts';

import { Applet } from './Applet';
import { EditAccessPopupProps, Applet as AppletType, Role } from './ManagersEditAccessPopup.types';
import { mockedApplets } from './ManagersEditAccessPopup.const';
import { StyledApplets, StyledError } from './ManagersEditAccessPopup.styles';
import { getRoleIcon } from './ManagersEditAccessPopup.utils';
import { EditAccessSuccessPopup } from '../EditAccessSuccessPopup';

export const EditAccessPopup = ({
  onClose,
  editAccessPopupVisible,
  user,
}: EditAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { firstName, lastName, email } = user;
  const [applets, setApplets] = useState<AppletType[]>(mockedApplets);
  const [appletsWithoutRespondents, setAppletsWithoutRespondents] = useState<string[]>([]);
  const [editAccessSuccessPopupVisible, setEditAccessSuccessPopupVisible] = useState(false);

  const getAppletsWithoutRespondents = () =>
    applets.reduce((acc: string[], el) => {
      if (
        el.roles.some((role) => role.label === Roles.Reviewer) &&
        !el?.selectedRespondents?.length
      ) {
        acc.push(el.title);
      }

      return acc;
    }, []);

  const updateAppletHandler = (
    id: string,
    callback: (roles: Role[]) => Role[],
    respondents?: string[] | null,
  ) => {
    const updatedApplets = applets.map((applet) =>
      applet.id === id
        ? {
            ...applet,
            roles: callback(applet.roles),
            selectedRespondents: respondents || applet.selectedRespondents,
          }
        : { ...applet },
    );
    setApplets(updatedApplets);
  };

  const handleRemoveRole = (id: string, label: Roles) =>
    updateAppletHandler(id, (roles) => roles.filter((role) => role.label !== label));

  const handleAddRole = (id: string, label: Roles) => {
    const callback = (roles: Role[]) =>
      label === Roles.Manager
        ? [{ label, icon: getRoleIcon(label) }]
        : [...roles, { label, icon: getRoleIcon(label) }];
    updateAppletHandler(id, callback);
  };

  const handleAddSelectedRespondents = (id: string, respondents: string[]) =>
    updateAppletHandler(id, (roles) => roles, respondents);

  const handleSubmit = () => {
    const appletsWithoutRespondents = getAppletsWithoutRespondents();
    setAppletsWithoutRespondents(appletsWithoutRespondents);
    if (!appletsWithoutRespondents.length) {
      setEditAccessSuccessPopupVisible(true);
    }
  };

  const handleSubmitSuccessPopup = () => {
    setEditAccessSuccessPopupVisible(false);
    onClose();
  };

  return (
    <>
      <Modal
        open={editAccessPopupVisible}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={t('editAccess')}
        buttonText={t('save')}
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
                addRole={handleAddRole}
                removeRole={handleRemoveRole}
                applet={applet}
                user={user}
                handleAddSelectedRespondents={handleAddSelectedRespondents}
                appletsWithoutRespondents={appletsWithoutRespondents}
              />
            ))}
          </StyledApplets>
          {appletsWithoutRespondents?.length > 0 && (
            <StyledError>
              <Trans
                i18nKey="editAccessNoRespondent"
                values={{ titles: appletsWithoutRespondents.map((el) => el).join(', ') }}
              />
            </StyledError>
          )}
        </>
      </Modal>
      {editAccessSuccessPopupVisible && (
        <EditAccessSuccessPopup
          open={editAccessSuccessPopupVisible}
          onClose={handleSubmitSuccessPopup}
          {...user}
        />
      )}
    </>
  );
};
