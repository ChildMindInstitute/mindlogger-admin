import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { SelectController } from 'components/FormComponents';
import { DefaultTabs as Tabs } from 'components';
import { UiType } from 'components/Tabs/Tabs.types';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import theme from 'styles/theme';

import { ActivityFormProps, FormValues } from '.';
import { tabs, defaultValues, activities } from './ActivityForm.const';

export const ActivityForm = ({ onSubmit }: ActivityFormProps) => {
  const { t } = useTranslation('app');

  const methods = useForm<FormValues>({
    defaultValues,
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate autoComplete="off">
        <StyledModalWrapper sx={{ mb: theme.spacing(2) }}>
          <SelectController
            fullWidth
            name="activity"
            options={activities}
            label={t('activity')}
            required
          />
        </StyledModalWrapper>
        <Tabs tabs={tabs} uiType={UiType.secondary} />
      </form>
    </FormProvider>
  );
};
