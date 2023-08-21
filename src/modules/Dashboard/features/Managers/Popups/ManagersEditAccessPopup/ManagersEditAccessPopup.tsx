import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Modal } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge, theme } from 'shared/styles';
import { Roles } from 'shared/consts';
import { workspaces } from 'redux/modules';
import { useAsync } from 'shared/hooks';
import { editManagerAccess } from 'api';
import { getErrorMessage } from 'shared/utils';

import { Applet } from './Applet';
import { Applet as AppletType, EditAccessPopupProps, Role } from './ManagersEditAccessPopup.types';
import { StyledApplets, StyledError } from './ManagersEditAccessPopup.styles';
import { getRoleIcon } from './ManagersEditAccessPopup.utils';

export const EditAccessPopup = ({
  onClose,
  editAccessPopupVisible,
  setEditAccessSuccessPopupVisible,
  user,
  reFetchManagers,
}: EditAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const { firstName, lastName, email, applets: userApplets, id } = user;
  const [applets, setApplets] = useState<AppletType[]>(userApplets);
  const [appletsWithoutRespondents, setAppletsWithoutRespondents] = useState<string[]>([]);

  const { ownerId } = workspaces.useData() || {};

  const { execute: handleEditAccess, error } = useAsync(editManagerAccess, () => {
    onClose();
    setEditAccessSuccessPopupVisible(true);
    reFetchManagers();
  });

  const getAppletsWithoutRespondents = () =>
    applets.reduce((acc: string[], el) => {
      if (
        el.roles.some(({ role }) => role === Roles.Reviewer) &&
        !el?.selectedRespondents?.length
      ) {
        acc.push(el.displayName);
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
    updateAppletHandler(id, (roles) => roles.filter(({ role }) => role !== label));

  const handleAddRole = (id: string, role: Roles) => {
    const callback = (roles: Role[]) =>
      role === Roles.Manager
        ? [{ role, icon: getRoleIcon(role) }]
        : [...roles, { role, icon: getRoleIcon(role) }];
    updateAppletHandler(id, callback);
  };

  const handleAddSelectedRespondents = (id: string, respondents: string[]) =>
    updateAppletHandler(id, (roles) => roles, respondents);

  const handleSubmit = () => {
    const appletsWithoutRespondents = getAppletsWithoutRespondents();
    setAppletsWithoutRespondents(appletsWithoutRespondents);
    if (!appletsWithoutRespondents.length) {
      const accesses = applets.map(({ id, roles, selectedRespondents }) => ({
        appletId: id,
        roles: roles.map(({ role }) => role),
        respondents: [...(selectedRespondents || [])],
      }));

      if (!ownerId || !accesses.length || accesses.some(({ roles }) => !roles.length)) {
        return;
      }

      handleEditAccess({ ownerId, userId: id, accesses });
    }
  };

  return (
    <>
      <Modal
        open={editAccessPopupVisible}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={t('editAccess')}
        buttonText={t('save')}
        disabledSubmit={!applets.length}
      >
        <>
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ margin: theme.spacing(-1.8, 0, 1.2) }}>
              <strong>
                {firstName} {lastName} ({email})
              </strong>
              {appletId
                ? ` ${t('hasTheFollowingRole')} ${applets?.[0]?.displayName}`
                : t('userHasAccess')}
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
          {error && <StyledError>{getErrorMessage(error)}</StyledError>}
        </>
      </Modal>
    </>
  );
};
