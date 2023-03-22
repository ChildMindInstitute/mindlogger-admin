import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from 'shared/components';
import { mockedWorkspaces as workspaces } from 'shared/layouts/BaseLayout/components/LeftBar/mocked';
import { StyledModalWrapper } from 'shared/styles';

import {
  AddToBuilderActions,
  AddToBuilderForm,
  AddToBuilderPopupProps,
  AddToBuilderSteps,
  Applet,
} from './AddToBuilderPopup.types';
import { getSteps } from './AddToBuilderPopup.utils';
import { addToBuilderPopupSchema } from './AddToBuilderPopup.schema';
import { StyledContainer } from './AddtoBuilderPopup.styles';
import { mockedApplets } from './mocked';

export const AddToBuilderPopup = ({
  addToBuilderPopupVisible,
  setAddToBuilderPopupVisible,
}: AddToBuilderPopupProps) => {
  const isSelectedWorkspaceVisible = true; // TODO: fix when the endpoint is ready
  // true if the user has multiple workspaces
  const { t } = useTranslation('app');
  const [step, setStep] = useState(
    isSelectedWorkspaceVisible
      ? AddToBuilderSteps.SelectWorkspace
      : AddToBuilderSteps.AddToBuilderActions,
  );
  const [applets, setApplets] = useState<Applet[]>([]);

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

  const handleModalClose = () => setAddToBuilderPopupVisible(false);

  const handleAddToBuilder = () => {
    const { addToBuilderAction } = getValues();
    if (+addToBuilderAction === AddToBuilderActions.CreateNewApplet) {
      // TODO: request to create a new applet and redirect to builder
      handleModalClose();
    }
    // TODO: request to get applets for selected account
    setApplets(mockedApplets);
    setStep(AddToBuilderSteps.SelectApplet);
  };

  const handleNext = async (nextStep?: AddToBuilderSteps) => {
    const isStepValid = await trigger();
    if (!isStepValid) return;
    if (nextStep) {
      return setStep(nextStep);
    }
    // TODO: fix when the endpoint is ready
    setStep(AddToBuilderSteps.Error);
  };

  const steps = useMemo(
    () =>
      getSteps({
        control,
        isSelectedWorkspaceVisible,
        workspaces,
        applets,
        setStep,
        setAddToBuilderPopupVisible,
        handleNext,
        handleAddToBuilder,
      }),
    [applets],
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
      <StyledModalWrapper>
        <StyledContainer>{steps[step].render()}</StyledContainer>
      </StyledModalWrapper>
    </Modal>
  );
};
