import { useEffect, useMemo, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { page } from 'resources';
import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { SingleApplet, workspaces as workspacesState } from 'shared/state';
import { useAsync, useNetwork } from 'shared/hooks';
import { authStorage, isManagerOrOwner, Path } from 'shared/utils';
import { getWorkspaceAppletsApi } from 'modules/Dashboard';
import { library } from 'modules/Library/state';
import { useAppDispatch } from 'redux/store';
import { STORAGE_SELECTED_KEY } from 'modules/Library/consts';

import {
  AddToBuilderActions,
  AddToBuilderForm,
  AddToBuilderPopupProps,
  AddToBuilderSteps,
  Applet,
} from './AddToBuilderPopup.types';
import { getAddToBuilderData, getArrayFromApplets, getSteps } from './AddToBuilderPopup.utils';
import { addToBuilderPopupSchema } from './AddToBuilderPopup.schema';
import { StyledContainer } from './AddToBuilderPopup.styles';
import { APPLETS_WITHOUT_LIMIT } from './AddToBuilderPopup.const';

export const AddToBuilderPopup = ({
  addToBuilderPopupVisible,
  setAddToBuilderPopupVisible,
}: AddToBuilderPopupProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const isOnline = useNetwork();

  const [applets, setApplets] = useState<Applet[]>([]);
  const workspacesWithRoles = workspacesState.useWorkspacesRolesData();
  const workspaces =
    workspacesWithRoles?.filter(
      (workspace) =>
        Object.keys(workspace.workspaceRoles).length === 0 || //in case there are no applets yet in the main Workspace
        Object.values(workspace.workspaceRoles).some((roles) => isManagerOrOwner(roles[0])),
    ) || [];
  const currentWorkspace = workspacesState.useData();
  const { result: cartItems } = library.useCartApplets() || {};
  const isWorkspacesModalVisible = workspaces.length > 1;
  const [step, setStep] = useState(
    isWorkspacesModalVisible
      ? AddToBuilderSteps.SelectWorkspace
      : AddToBuilderSteps.AddToBuilderActions,
  );

  const validationSchema = addToBuilderPopupSchema();
  const { trigger, control, getValues, setValue } = useForm<AddToBuilderForm>({
    mode: 'onChange',
    defaultValues: {
      selectedWorkspace: '',
      addToBuilderAction: AddToBuilderActions.CreateNewApplet,
      selectedApplet: '',
    },
    resolver: yupResolver(validationSchema[step]),
  });

  const { execute: getWorkspaceApplets, isLoading } = useAsync(
    getWorkspaceAppletsApi,
    (applets) => {
      setApplets(getArrayFromApplets(applets?.data?.result || []));
    },
  );

  const navigateToBuilder = (appletId: string, data: SingleApplet) => {
    navigate(generatePath(page.builderAppletAbout, { appletId }), {
      state: { isFromLibrary: true, data },
    });
  };

  const handleModalClose = () => setAddToBuilderPopupVisible(false);

  const handleSwitchWorkspace = (ownerId: string) => {
    if (currentWorkspace?.ownerId !== ownerId) {
      const newWorkspace = workspaces.find((workspace) => workspace.ownerId === ownerId);
      if (newWorkspace) {
        authStorage.setWorkspace(newWorkspace);
        dispatch(workspacesState.actions.setCurrentWorkspace(newWorkspace));
      }
    }
  };

  const handleClearCart = () => {
    sessionStorage.removeItem(STORAGE_SELECTED_KEY);
    dispatch(library.thunk.postAppletsToCart([]));
  };

  const handleAddToBuilder = async () => {
    if (!isOnline) {
      return setStep(AddToBuilderSteps.Error);
    }

    const { addToBuilderAction, selectedWorkspace: ownerId } = getValues();

    if (addToBuilderAction === AddToBuilderActions.CreateNewApplet) {
      const { appletToBuilder } = await getAddToBuilderData(cartItems);
      handleSwitchWorkspace(ownerId);
      navigateToBuilder(Path.NewApplet, appletToBuilder as SingleApplet);
      handleClearCart();
      handleModalClose();
    }

    if (!ownerId) {
      setStep(AddToBuilderSteps.Error);

      return;
    }
    setStep(AddToBuilderSteps.SelectApplet);
  };
  const handleAddToExistingApplet = async () => {
    if (!isOnline) {
      return setStep(AddToBuilderSteps.Error);
    }

    const { selectedWorkspace: ownerId, selectedApplet } = getValues();
    const { appletToBuilder } = await getAddToBuilderData(cartItems);
    if (!selectedApplet || !appletToBuilder) {
      setStep(AddToBuilderSteps.Error);

      return;
    }
    handleSwitchWorkspace(ownerId);
    navigateToBuilder(selectedApplet, appletToBuilder as SingleApplet);
    handleClearCart();
    handleModalClose();
  };

  const handleNext = async (nextStep?: AddToBuilderSteps) => {
    const isStepValid = await trigger();
    if (!isStepValid) return;
    if (nextStep) {
      return setStep(nextStep);
    }
  };

  const errorCallback = () => {
    const { addToBuilderAction } = getValues();
    if (addToBuilderAction === AddToBuilderActions.CreateNewApplet) {
      return handleAddToBuilder();
    }

    return handleAddToExistingApplet();
  };

  const steps = useMemo(
    () =>
      getSteps({
        control,
        isWorkspacesModalVisible,
        workspaces,
        applets,
        setStep,
        setAddToBuilderPopupVisible,
        handleNext,
        handleAddToBuilder,
        handleAddToExistingApplet,
        errorCallback,
      }),
    [applets, isWorkspacesModalVisible, workspaces],
  );

  useEffect(() => {
    if (workspaces.length === 1) setValue('selectedWorkspace', workspaces[0].ownerId);
  }, [workspaces]);

  useEffect(() => {
    if (step === AddToBuilderSteps.AddToBuilderActions) {
      const { selectedWorkspace: ownerId } = getValues();
      if (!ownerId) return;
      getWorkspaceApplets({
        params: { ownerId, limit: APPLETS_WITHOUT_LIMIT, flatList: true },
      });
    }
  }, [step]);

  return (
    <Modal
      open={addToBuilderPopupVisible}
      onClose={handleModalClose}
      onSubmit={steps[step].onSubmitStep}
      title={t(steps[step].popupTitle)}
      buttonText={t(steps[step].buttonText)}
      hasSecondBtn={steps[step].hasSecondBtn}
      secondBtnText={t(steps[step]?.secondBtnText || '')}
      onSecondBtnSubmit={steps[step].onSecondBtnSubmit}
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <StyledContainer>{steps[step].render()}</StyledContainer>
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
