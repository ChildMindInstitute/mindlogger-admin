import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { mockedWorkspaces as accounts } from 'shared/components/LeftBar/mocked';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import {
  AddToBuilderActions,
  AddToBuilderForm,
  AddToBuilderPopupProps,
  AddToBuilderSteps,
  Applet,
} from './AddToBuilderPopup.types';
import { getSteps } from './AddToBuilderPopup.utils';
import { mockedApplets } from './mocked';

export const AddToBuilderPopup = ({
  addToBuilderPopupVisible,
  setAddToBuilderPopupVisible,
}: AddToBuilderPopupProps) => {
  const isSelectAccountVisible = true; // TODO: fix when the endpoint is ready
  // true if the user has multiple accounts
  const { t } = useTranslation('app');
  const { control, getValues } = useForm<AddToBuilderForm>({
    defaultValues: {
      selectedAccount: '',
      addToBuilderAction: AddToBuilderActions.CreateNewApplet,
      selectedApplet: '',
    },
  });
  const [step, setStep] = useState(
    isSelectAccountVisible
      ? AddToBuilderSteps.SelectAccount
      : AddToBuilderSteps.AddToBuilderActions,
  );
  const [applets, setApplets] = useState<Applet[]>([]);

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

  const handleContinue = () => {
    console.log(getValues());
    handleModalClose();
  };

  const steps = useMemo(
    () =>
      getSteps({
        control,
        isSelectAccountVisible,
        accounts,
        applets,
        setStep,
        setAddToBuilderPopupVisible,
        handleAddToBuilder,
        handleContinue,
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
      <StyledModalWrapper>{steps[step].render()}</StyledModalWrapper>
    </Modal>
  );
};
