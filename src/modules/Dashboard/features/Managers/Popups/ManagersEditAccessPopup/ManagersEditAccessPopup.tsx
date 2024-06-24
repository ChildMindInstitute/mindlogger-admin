import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Modal, SpinnerUiType, Spinner } from 'shared/components';
import { StyledModalWrapper, StyledBodyLarge, theme } from 'shared/styles';
import { Roles } from 'shared/consts';
import { workspaces } from 'redux/modules';
import { useAsync } from 'shared/hooks/useAsync';
import { editManagerAccessApi, removeManagerAccessApi } from 'api';
import { Mixpanel, MixpanelProps, getErrorMessage, pluck } from 'shared/utils';

import { Applet } from './Applet';
import { Applet as AppletType, EditAccessPopupProps, Role } from './ManagersEditAccessPopup.types';
import { StyledApplets, StyledError } from './ManagersEditAccessPopup.styles';
import { getRoleIcon } from './ManagersEditAccessPopup.utils';

export const EditAccessPopup = ({ onClose, popupVisible, user }: EditAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams() || {};
  const { firstName, lastName, email, applets: userApplets, id } = user;
  const [applets, setApplets] = useState<AppletType[]>(userApplets);
  const [appletsWithoutRespondents, setAppletsWithoutRespondents] = useState<string[]>([]);

  const { ownerId } = workspaces.useData() || {};
  const submittedAccessesRef = useRef<{ appletId: string; roles: Roles[] }[]>([]);

  const {
    execute: handleEditAccess,
    error: editAccessError,
    isLoading: isEditAccessLoading,
  } = useAsync(editManagerAccessApi, () => {
    for (const { appletId, roles } of submittedAccessesRef.current) {
      Mixpanel.track('Team Member edited successfully', {
        [MixpanelProps.AppletId]: appletId,
        [MixpanelProps.Roles]: roles,
      });
    }

    onClose(true);
  });
  const {
    execute: handleRemoveAccess,
    error: removeAccessError,
    isLoading: isRemoveAccessLoading,
  } = useAsync(removeManagerAccessApi);
  const isLoading = isEditAccessLoading || isRemoveAccessLoading;
  const error = removeAccessError || editAccessError;

  const getAppletsWithoutRespondents = () =>
    applets.reduce((acc: string[], applet) => {
      const reviewerRole = applet.roles.find(({ role }) => role === Roles.Reviewer);

      if (reviewerRole && !reviewerRole?.reviewerSubjects?.length) acc.push(applet.displayName);

      return acc;
    }, []);

  const onCloseHandler = () => onClose();

  const updateAppletHandler = (id: string, callback: (roles: Role[]) => Role[]) => {
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

  const handleRemoveRole = (id: string, label: Roles) =>
    updateAppletHandler(id, (roles) => roles.filter(({ role }) => role !== label));

  const handleAddRole = (id: string, role: Roles) => {
    const callback = (roles: Role[]) => [...roles, { role, icon: getRoleIcon(role) }];

    updateAppletHandler(id, callback);
  };

  const handleAddSelectedRespondents = (id: string, respondents: string[]) =>
    updateAppletHandler(id, (roles) =>
      roles.map((role) => ({
        ...role,
        ...(role.role === Roles.Reviewer && { reviewerSubjects: respondents }),
      })),
    );

  const handleSubmit = async () => {
    const appletsWithoutRespondents = getAppletsWithoutRespondents();
    setAppletsWithoutRespondents(appletsWithoutRespondents);
    if (!appletsWithoutRespondents.length) {
      const accesses = applets.map(({ id, roles }) => ({
        appletId: id,
        roles: roles.map(({ role }) => role),
        subjects: roles.flatMap(({ reviewerSubjects }) => reviewerSubjects ?? []),
      }));

      if (!ownerId || !accesses.length || accesses.some(({ roles }) => !roles.length)) {
        return;
      }

      submittedAccessesRef.current = accesses;
      for (const { appletId, roles } of accesses) {
        Mixpanel.track('Edit Team Member form submitted', {
          [MixpanelProps.AppletId]: appletId,
          [MixpanelProps.Roles]: roles,
        });
      }

      await handleRemoveAccess({ appletIds: pluck(applets, 'id'), userId: user.id });
      handleEditAccess({ ownerId, userId: id, accesses });
    }
  };

  return (
    <Modal
      open={popupVisible}
      onClose={onCloseHandler}
      onSubmit={handleSubmit}
      title={t('editAccess')}
      buttonText={t('save')}
      disabledSubmit={!applets.length}
      data-testid="dashboard-managers-edit-access-popup"
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
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
  );
};
