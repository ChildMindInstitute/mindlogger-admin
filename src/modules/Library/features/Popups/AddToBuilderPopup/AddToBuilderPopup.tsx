import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { SingleApplet, workspaces as workspacesState } from 'shared/state';
import { useAsync, useNetwork } from 'shared/hooks';
import { authStorage, Path } from 'shared/utils';
import { MAX_LIMIT } from 'shared/consts';
import { library } from 'modules/Library/state';
import { useAppDispatch } from 'redux/store';
import { navigateToBuilder, getAddToBuilderData } from 'modules/Library/features/Cart/Cart.utils';
import { useClearCart } from 'modules/Library/features/Cart/Cart.hooks';
import { useWorkspaceList } from 'modules/Library/hooks';
import { getWorkspaceAppletsApi } from 'api';

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

const dataTestid = 'library-cart-add-to-builder-popup';

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
  const [hasAppletAccessError, setAppletAccessError] = useState(false);
  const {
    workspaces,
    isLoading: isWorkspacesLoading,
    checkIfHasAccessToWorkspace,
  } = useWorkspaceList();

  const currentWorkspace = workspacesState.useData();
  const { result: cartItems } = library.useCartApplets() || {};
  const isWorkspacesModalVisible = workspaces.length > 1;
  const [step, setStep] = useState(AddToBuilderSteps.LoadingWorkspaces);

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

    const hasAccess = await checkIfHasAccessToWorkspace(ownerId);
    if (!hasAccess) {
      return setStep(AddToBuilderSteps.AccessError);
    }

    if (addToBuilderAction === AddToBuilderActions.CreateNewApplet) {
      const hasAccess = await checkIfHasAccessToWorkspace(ownerId);
      if (!hasAccess) {
        return setStep(AddToBuilderSteps.AccessError);
      }

      await handleAddToBuilder(false, ownerId, null);
    }

    setStep(AddToBuilderSteps.SelectApplet);
  };

  const handleAddToExistingApplet = async () => {
    const { selectedWorkspace: ownerId, selectedApplet } = getValues();
    if (!isOnline || !ownerId || !selectedApplet) {
      return setStep(AddToBuilderSteps.Error);
    }

    if (workspaces.length > 1) {
      const hasAccessToWorkspace = await checkIfHasAccessToWorkspace(ownerId);
      if (!hasAccessToWorkspace) {
        return setStep(AddToBuilderSteps.AccessError);
      }

      const { data } = await getWorkspaceApplets({
        params: { ownerId, limit: MAX_LIMIT, flatList: true },
      });
      const applets = getArrayFromApplets(data?.result);

      if (!applets.some((applet) => applet.id === selectedApplet)) {
        setAppletAccessError(true);

        return setStep(AddToBuilderSteps.AccessError);
      }
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
        hasAppletAccessError,
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
    if (step !== AddToBuilderSteps.LoadingWorkspaces || isWorkspacesLoading) return;

    if (workspaces.length === 1) {
      setValue('selectedWorkspace', workspaces[0].ownerId);

      return setStep(AddToBuilderSteps.AddToBuilderActions);
    }

    setStep(AddToBuilderSteps.SelectWorkspace);
  }, [workspaces, isWorkspacesLoading]);

  useEffect(() => {
    if (step === AddToBuilderSteps.AddToBuilderActions) {
      const { selectedWorkspace: ownerId } = getValues();
      if (!ownerId) return;
      getWorkspaceApplets({
        params: { ownerId, limit: MAX_LIMIT, flatList: true },
      });
    }
  }, [step]);

  const isSpinnerVisible =
    isLoading || (isWorkspacesLoading && step !== AddToBuilderSteps.LoadingWorkspaces);

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
      data-testid={dataTestid}
    >
      <>
        {isSpinnerVisible && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper data-testid={`${dataTestid}-step-${step}`}>
          <StyledContainer>{steps[step].render()}</StyledContainer>
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
