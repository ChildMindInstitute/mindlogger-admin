import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { CheckboxController } from 'shared/components/FormComponents';
import {
  StyledModalWrapper,
  StyledBodyLarge,
  StyledLabelLarge,
  StyledTitleBoldMedium,
  StyledFlexTopCenter,
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  theme,
  StyledErrorText,
} from 'shared/styles';
import { Table, UiType, Modal } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { removeManagerAccess } from 'api';
import { getErrorMessage } from 'shared/utils';

import { buttonTextByStep, getHeadCells } from './ManagersRemoveAccessPopup.const';
import { RemoveAccessPopupProps, FormValues } from './ManagersRemoveAccessPopupProps.types';

export const ManagersRemoveAccessPopup = ({
  removeAccessPopupVisible,
  onClose,
  user,
}: RemoveAccessPopupProps) => {
  const { t } = useTranslation('app');
  const { firstName, lastName, email, applets } = user;

  const [step, setStep] = useState<number>(0);
  const incrementStep = () => setStep((prevStep) => prevStep + 1);
  const decrementStep = () => setStep((prevStep) => prevStep - 1);

  const defaultValues = applets.map(({ displayName, id, image }) => ({
    displayName,
    id,
    image,
    value: false,
  }));

  const { control, watch } = useForm<FormValues>({
    defaultValues: { userApplets: defaultValues },
  });

  const watchedUserApplets = watch('userApplets');

  const selectedApplets = watchedUserApplets.filter((applet) => applet.value);

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
          name={`userApplets.${index}.value`}
          label={<></>}
        />
      ),
      value: id,
      width: '200',
    },
  }));

  const { execute, error } = useAsync(removeManagerAccess, incrementStep);

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
      default:
        onClose();

        return;
    }
  };

  const listOfSelectedApplets = selectedApplets?.map((applet) => (
    <StyledTitleBoldMedium key={applet.id}>- {applet.displayName} </StyledTitleBoldMedium>
  ));

  const getFirstScreen = () => (
    <form noValidate>
      <StyledBodyLarge sx={{ marginBottom: theme.spacing(2.4) }}>
        <strong>
          {firstName} {lastName} ({email})
        </strong>
        {t('userHasAccess')}
      </StyledBodyLarge>
      <Table columns={getHeadCells()} rows={rows} orderBy="name" uiType={UiType.Secondary} />
    </form>
  );

  const getSecondScreen = () => {
    const { displayName } = selectedApplets[0];

    return (
      <StyledBodyLarge>
        <Trans i18nKey="confirmRemoveAccess">
          Are you sure that you want to remove the access for the
          <strong>
            <>
              {{ firstName }} {{ lastName }} ({{ email }})
            </>
          </strong>
          the
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

  const getThirdScreen = () => {
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

  const getThirdMultipleScreen = () => (
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
            </strong>{' '}
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
  ];

  return (
    <Modal
      open={removeAccessPopupVisible}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('removeAccess')}
      hasSecondBtn={step === 1}
      secondBtnText={t('back')}
      onSecondBtnSubmit={decrementStep}
      buttonText={t(buttonTextByStep[step as keyof typeof buttonTextByStep])}
      disabledSubmit={!selectedApplets.length}
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
