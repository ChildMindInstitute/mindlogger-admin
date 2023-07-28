import { useMemo, useState } from 'react';
import { useNavigate, generatePath } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Spinner } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { SingleApplet, workspaces } from 'shared/state';
import { useAsync } from 'shared/hooks';
import { getWorkspaceAppletsApi } from 'modules/Dashboard';
import { library } from 'modules/Library/state';
import { page } from 'resources';
import { Path, authStorage } from 'shared/utils';
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
  const dispatch = useAppDispatch();
  const [applets, setApplets] = useState<Applet[]>([]);
  const { result: workspacesData = [] } = workspaces.useWorkspacesData() || {};
  const currentWorkspace = workspaces.useData();
  const { result: cartItems } = library.useCartApplets() || {};
  const isWorkspacesModalVisible = workspacesData.length > 1;

  // TODO: get all applets including applets in folders (backend task M2-2580)
  const { execute: getWorkspaceApplets, isLoading } = useAsync(
    getWorkspaceAppletsApi,
    (applets) => {
      setApplets(getArrayFromApplets(applets?.data?.result || []));
    },
  );

  const { t } = useTranslation('app');
  const [step, setStep] = useState(
    isWorkspacesModalVisible
      ? AddToBuilderSteps.SelectWorkspace
      : AddToBuilderSteps.AddToBuilderActions,
  );

  const validationSchema = addToBuilderPopupSchema();
  const { trigger, control, getValues } = useForm<AddToBuilderForm>({
    mode: 'onChange',
    defaultValues: {
      selectedWorkspace: '',
      addToBuilderAction: AddToBuilderActions.CreateNewApplet,
      selectedApplet: '',
    },
    resolver: yupResolver(validationSchema[step]),
  });

  const navigateToBuilder = (appletId: string, data: SingleApplet) => {
    navigate(generatePath(page.builderAppletAbout, { appletId }), {
      state: { isFromLibrary: true, data },
    });
  };

  const handleModalClose = () => setAddToBuilderPopupVisible(false);

  const handleSwitchWorkspace = (ownerId: string) => {
    if (currentWorkspace?.ownerId !== ownerId) {
      const newWorkspace = workspacesData.find((workspace) => workspace.ownerId === ownerId);
      if (newWorkspace) {
        authStorage.setWorkspace(newWorkspace);
        dispatch(workspaces.actions.setCurrentWorkspace(newWorkspace));
      }
    }
  };

  const handleClearCart = () => {
    sessionStorage.removeItem(STORAGE_SELECTED_KEY);
    dispatch(library.thunk.postAppletsToCart([]));
  };

  const handleAddToBuilder = async () => {
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

    await getWorkspaceApplets({ params: { ownerId, limit: APPLETS_WITHOUT_LIMIT } });
    setStep(AddToBuilderSteps.SelectApplet);
  };
  const handleAddToExistingApplet = async () => {
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

  const steps = useMemo(
    () =>
      getSteps({
        control,
        isWorkspacesModalVisible,
        workspaces: workspacesData,
        applets,
        setStep,
        setAddToBuilderPopupVisible,
        handleNext,
        handleAddToBuilder,
        handleAddToExistingApplet,
      }),
    [applets, isWorkspacesModalVisible, workspaces],
  );

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
        {isLoading && <Spinner />}
        <StyledModalWrapper>
          <StyledContainer>{steps[step].render()}</StyledContainer>
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
