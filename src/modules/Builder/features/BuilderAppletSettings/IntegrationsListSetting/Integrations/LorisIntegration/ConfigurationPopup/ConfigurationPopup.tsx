import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';

import { Modal } from 'shared/components/Modal';
import { Svg } from 'shared/components';
import {
  StyledBodyMedium,
  StyledModalWrapper,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';

import {
  ConfigurationForm,
  ConfigurationPopupProps,
  ConfigurationsSteps,
} from './ConfigurationPopup.types';
import { configurationFormSchema } from './ConfigurationPopup.schema';
import { getScreens } from './ConfigurationPopup.utils';

export const ConfigurationPopup = ({ open, onClose }: ConfigurationPopupProps) => {
  const { t } = useTranslation();
  const methods = useForm<ConfigurationForm>({
    resolver: yupResolver(configurationFormSchema()),
    defaultValues: {
      hostname: '',
      username: '',
      password: '',
      project: '',
    },
  });

  const { control, handleSubmit } = methods;

  const [step, setStep] = useState(ConfigurationsSteps.LorisConfigurations);
  const [error, setError] = useState();

  // eslint-disable-next-line unused-imports/no-unused-vars
  const saveConfiguration = ({ project, ...config }: ConfigurationForm) => {
    console.log('Configuration:', config);
    setStep(ConfigurationsSteps.SelectProject);
  };

  const saveProject = ({ project }: ConfigurationForm) => {
    console.log('Project:', project);
    onClose();
  };

  const onNext = useCallback(() => {
    handleSubmit(saveConfiguration)();
  }, [handleSubmit]);

  const onSave = useCallback(() => {
    handleSubmit(saveProject)();
  }, [handleSubmit]);

  const screens = useMemo(
    () =>
      getScreens({
        control: control as unknown as Control<FieldValues>,
        setStep,
        onClose,
        onNext,
        projects: [
          {
            id: 'project1',
            name: 'Comprehensive Medical Consultation and Examination Appointment with a Healthcare Professional',
          },
          {
            id: 'project2',
            name: 'Thorough Health Assessment and Consultation with a Qualified Medical Practition',
          },
        ],
        onSave,
      }),
    [control, setStep, onClose, onNext, onSave],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <>
          <Box sx={{ mr: theme.spacing(1.2) }}>
            <Svg width={94} height={94} id="loris-integration" />
          </Box>
          {t('loris.configurationPopupTitle')}
        </>
      }
      disabledSubmit={screens[step].disabledRightButton}
      onSubmit={screens[step].rightButtonClick}
      buttonText={screens[step].rightButtonText}
      hasLeftBtn
      onLeftBtnSubmit={screens[step].leftButtonClick}
      leftBtnText={screens[step].leftButtonText}
      data-testid="loris-configuration-popup"
      height="60rem"
    >
      <StyledModalWrapper>
        <StyledTitleMedium sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.2) }}>
          {screens[step].description}
        </StyledTitleMedium>
        <FormProvider {...methods}>
          <form noValidate>{screens[step].content}</form>
        </FormProvider>
        {error && (
          <StyledBodyMedium
            sx={{ color: variables.palette.semantic.error, mt: theme.spacing(1.8) }}
            data-testid="upload-data-popup-error"
          >
            {error}
          </StyledBodyMedium>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
