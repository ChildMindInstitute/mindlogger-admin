import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { SelectController } from 'components/FormComponents';
import { Modal } from 'components/Popups';
import { DefaultTabs as Tabs } from 'components';
import { UiType } from 'components/Tabs/Tabs.types';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import theme from 'styles/theme';

import { CreateActivityPopupProps, FormValues } from './CreateActivityPopup.types';
import { tabs, defaultValues, activities } from './CreateActivityPopup.const';

export const CreateActivityPopup = ({ onClose, open }: CreateActivityPopupProps) => {
  const { t } = useTranslation('app');

  const methods = useForm<FormValues>({
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = () => onClose();

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t('createActivitySchedule')}
      buttonText={t('save')}
      width="67.1"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate autoComplete="off">
          <StyledModalWrapper sx={{ mb: theme.spacing(2) }}>
            <SelectController
              fullWidth
              name="activity"
              options={activities}
              label={t('activity*')}
            />
          </StyledModalWrapper>
          <Tabs tabs={tabs} uiType={UiType.secondary} />
        </form>
      </FormProvider>
    </Modal>
  );
};
