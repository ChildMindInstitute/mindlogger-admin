import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { removeManagerAccessApi } from 'api';
import { Modal, Table, UiType } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';
import { useAsync } from 'shared/hooks/useAsync';
import {
  StyledBodyLarge,
  StyledErrorText,
  StyledFlexTopCenter,
  StyledLabelLarge,
  StyledModalWrapper,
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  StyledTitleBoldMedium,
  theme,
  variables,
} from 'shared/styles';
import { getErrorMessage } from 'shared/utils';

import { buttonTextByStep, getHeadCells } from './ManagersRemoveAccessPopup.const';
import { FormValues, RemoveAccessPopupProps } from './ManagersRemoveAccessPopupProps.types';

export const ManagersRemoveAccessPopup = ({
  popupVisible,
  onClose,
  user,
}: RemoveAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams() || {};

  const { firstName, lastName, email, applets } = user;

  const [step, setStep] = useState<number>(appletId ? 1 : 0);

  const incrementStep = () => setStep((prevStep) => prevStep + 1);
  const decrementStep = () => setStep((prevStep) => prevStep - 1);

  const defaultValues = applets?.map(({ displayName, id, image }) => ({
    displayName,
    id,
    image,
    value: false,
  }));

  const { control, watch } = useForm<FormValues>({
    defaultValues: { userApplets: defaultValues },
  });

  const watchedUserApplets = watch('userApplets');

  const getSelectedApplets = () => {
    if (appletId) {
      const selectedApplet = watchedUserApplets.find((applet) => applet.id === appletId);

      return selectedApplet ? [selectedApplet] : [];
    }

    return watchedUserApplets.filter((applet) => applet.value);
  };

  const selectedApplets = getSelectedApplets();

  const rows = watchedUserApplets?.map(({ displayName, image, id }, index) => ({
    name: {
      content: () => (
        <StyledFlexTopCenter>
          {image ? (
            <StyledSmallAppletImg src={image} alt="Applet image" />
          ) : (
            <StyledSmallAppletImgPlaceholder />
          )}
          <StyledLabelLarge>{displayName}</StyledLabelLarge>
        </StyledFlexTopCenter>
      ),
      value: displayName || '',
    },
    actions: {
      content: () => (
        <CheckboxController
          key={id}
          control={control}
          onCustomChange={() => setError(null)}
          name={`userApplets.${index}.value`}
          label={<></>}
          data-testid={`dashboard-managers-remove-access-popup-checkbox-${index}`}
        />
      ),
      value: id,
      width: '200',
    },
  }));

  const onCloseHandler = () => onClose(step);

  const { execute, error, setError } = useAsync(
    removeManagerAccessApi,
    () => setStep(3),
    () => setStep(2),
  );

  const onSubmit = () => {
    switch (step) {
      case 0:
        return incrementStep();
      case 1:
        execute({
          appletIds: selectedApplets.map((item) => item.id),
          userId: user.id,
        });
        break;
      case 2:
        execute({
          appletIds: selectedApplets.map((item) => item.id),
          userId: user.id,
        });
        break;
      default:
        onCloseHandler();

        return;
    }
  };

  const listOfSelectedApplets = selectedApplets?.map((applet) => (
    <StyledTitleBoldMedium key={applet?.id}>- {applet.displayName} </StyledTitleBoldMedium>
  ));

  const getFirstScreen = () => (
    <form noValidate>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <strong>
          {firstName} {lastName} ({email})
        </strong>
        {t('userHasAccess')}
      </StyledBodyLarge>
      <Table
        columns={getHeadCells()}
        rows={rows}
        orderBy="name"
        uiType={UiType.Secondary}
        tableHeadBg={variables.modalBackground}
      />
    </form>
  );

  const getSecondScreen = () => {
    const { displayName } = selectedApplets[0];

    return (
      <StyledBodyLarge data-testid="dashboard-managers-remove-access-popup-second-screen">
        <Trans i18nKey="confirmRemoveAccess">
          Are you sure that you want to remove the access for the
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          to the Applet
          <strong>
            <>{{ displayName }}</>
          </strong>
          ?
        </Trans>
      </StyledBodyLarge>
    );
  };

  const getSecondMultipleScreen = () => (
    <>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <Trans i18nKey="confirmMultipleRemoveAccess">
          Are you sure that you want to remove the access for the
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          to the list of Applets below?
        </Trans>
      </StyledBodyLarge>
      {listOfSelectedApplets}
    </>
  );

  const getThirdMultipleScreen = () => (
    <>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4), color: variables.palette.error }}>
        <Trans i18nKey="multipleRemoveAccessError">
          Access for
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          to the list of Applets below has not been removed. Please try again.
        </Trans>
      </StyledBodyLarge>
      {listOfSelectedApplets}
    </>
  );

  const getThirdScreen = () => {
    const { displayName } = selectedApplets[0];

    return (
      <StyledBodyLarge sx={{ color: variables.palette.error }}>
        <Trans i18nKey="removeAccessError">
          Access for the
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          to the
          <strong>
            <>{{ displayName }}</>
          </strong>
          has not been removed. Please try again.
        </Trans>
      </StyledBodyLarge>
    );
  };

  const getFourthScreen = () => {
    const { displayName } = selectedApplets[0];

    return (
      <StyledBodyLarge>
        <Trans i18nKey="removeAccessSuccess">
          Access for
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          to the
          <strong>
            <>{{ displayName }}</>
          </strong>
          has been removed successfully.
        </Trans>
      </StyledBodyLarge>
    );
  };

  const getFourthMultipleScreen = () => (
    <>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <Trans i18nKey="multipleRemoveAccessSuccess">
          Access for
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          to the list of Applets below has been removed successfully.
        </Trans>
      </StyledBodyLarge>
      {listOfSelectedApplets}
      {!applets.length && (
        <StyledBodyLarge sx={{ marginTop: theme.spacing(2.4) }}>
          <Trans i18nKey="userHasNoAccessToAnyApplets">
            <strong>
              <>
                {{ firstName }} {{ lastName }} ({{ email }})
              </>
            </strong>
            no longer has access to any Applets.
          </Trans>
        </StyledBodyLarge>
      )}
    </>
  );

  const isOneSelected = selectedApplets.length === 1;

  const screenByStep = [
    getFirstScreen(),
    isOneSelected ? getSecondScreen() : getSecondMultipleScreen(),
    isOneSelected ? getThirdScreen() : getThirdMultipleScreen(),
    isOneSelected ? getFourthScreen() : getFourthMultipleScreen(),
  ];

  return (
    <Modal
      open={popupVisible}
      onClose={onCloseHandler}
      onSubmit={onSubmit}
      title={t('removeAccess')}
      hasSecondBtn={(appletId ? step > 1 : step > 0) && step < 3}
      secondBtnText={t('back')}
      disabledSecondBtn={!!appletId}
      onSecondBtnSubmit={decrementStep}
      buttonText={t(buttonTextByStep[step as keyof typeof buttonTextByStep])}
      disabledSubmit={!selectedApplets.length}
      data-testid="dashboard-managers-remove-access-popup"
    >
      <StyledModalWrapper>
        {screenByStep[step]}
        {error && step === 1 && (
          <StyledErrorText sx={{ mt: theme.spacing(1) }}>{getErrorMessage(error)}</StyledErrorText>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
