import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { SingleApplet, workspaces as workspacesState } from 'shared/state';
import { useAsync, useNetwork } from 'shared/hooks';
import { authStorage, isManagerOrOwnerOrEditor, Path } from 'shared/utils';
import { MAX_LIMIT } from 'shared/consts';
import { getWorkspaceAppletsApi } from 'modules/Dashboard';
import { library } from 'modules/Library/state';
import { useAppDispatch } from 'redux/store';
import { navigateToBuilder, getAddToBuilderData } from 'modules/Library/features/Cart/Cart.utils';
import { useClearCart } from 'modules/Library/features/Cart/Cart.hooks';

import {
  AddToBuilderActions,
  AddToBuilderForm,
  AddToBuilderPopupProps,
  AddToBuilderSteps,
  Applet,
} from './AddToBuilderPopup.types';
import { getArrayFromApplets, getSteps } from './AddToBuilderPopup.utils';
import { addToBuilderPopupSchema } from './AddToBuilderPopup.schema';
import { StyledContainer } from './AddToBuilderPopup.styles';

export const AddToBuilderPopup = ({
  addToBuilderPopupVisible,
  setAddToBuilderPopupVisible,
}: AddToBuilderPopupProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const isOnline = useNetwork();
  const handleClearCart = useClearCart();
  const [applets, setApplets] = useState<Applet[]>([]);
  const workspacesWithRoles = workspacesState.useWorkspacesRolesData();
  const workspaces =
    workspacesWithRoles?.filter(
      (workspace) =>
        Object.keys(workspace.workspaceRoles).length === 0 || //in case there are no applets yet in the main Workspace
        Object.values(workspace.workspaceRoles).some((roles) => isManagerOrOwnerOrEditor(roles[0])),
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

  const handleAddToBuilder = async (
    isAddToExistingApplet: boolean,
    ownerId: string,
    selectedApplet: string | null,
  ) => {
    const { appletToBuilder } = await getAddToBuilderData(cartItems);
    handleSwitchWorkspace(ownerId);
    navigateToBuilder(
      navigate,
      isAddToExistingApplet && selectedApplet ? selectedApplet : Path.NewApplet,
      appletToBuilder as SingleApplet,
    );
    handleClearCart();
    handleModalClose();
  };

  const handleAddToNewApplet = async () => {
    const { addToBuilderAction, selectedWorkspace: ownerId } = getValues();
    if (!isOnline || !ownerId) {
      return setStep(AddToBuilderSteps.Error);
    }

    if (addToBuilderAction === AddToBuilderActions.CreateNewApplet) {
      await handleAddToBuilder(false, ownerId, null);
    }

    setStep(AddToBuilderSteps.SelectApplet);
  };
  const handleAddToExistingApplet = async () => {
    const { selectedWorkspace: ownerId, selectedApplet } = getValues();
    if (!isOnline || !ownerId || !selectedApplet) {
      return setStep(AddToBuilderSteps.Error);
    }

    await handleAddToBuilder(true, ownerId, selectedApplet);
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
      return handleAddToNewApplet();
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
        handleAddToNewApplet,
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
        params: { ownerId, limit: MAX_LIMIT, flatList: true },
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
      data-testid="library-cart-add-to-builder-popup"
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
