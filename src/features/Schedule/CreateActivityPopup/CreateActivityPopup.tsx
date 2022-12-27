import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { SelectController } from 'components/FormComponents';
import { Modal } from 'components/Popups';
import { DefaultTabs as Tabs } from 'components/Tabs';
import { UiType } from 'components/Tabs/Tabs.types';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';

import { CreateActivityPopupProps, FormValues } from './CreateActivityPopup.types';
import { tabs } from './CreateActivityPopup.const';

export const CreateActivityPopup = ({ onClose, open }: CreateActivityPopupProps) => {
  const { t } = useTranslation('app');
  const methods = useForm<FormValues>({
    defaultValues: {
      activity: '',
      availability: true,
      completion: false,
      timeout: {
        access: false,
      },
    },
    mode: 'onChange',
  });

  const onSubmit = () => null;
  const options = [
    {
      value: '',
      labelKey: 'To-Be Mood',
    },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSubmit={() => null}
      title="Create Activity Schedule"
      buttonText={t('save')}
      width="60"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <StyledModalWrapper>
            <SelectController fullWidth name="activity" options={options} label={t('activity*')} />
          </StyledModalWrapper>
          <Tabs tabs={tabs} uiType={UiType.secondary} />
        </form>
      </FormProvider>
    </Modal>
  );
};
