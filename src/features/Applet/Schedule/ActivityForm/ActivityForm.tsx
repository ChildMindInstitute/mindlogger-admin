import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { SelectController } from 'components/FormComponents';
import { DefaultTabs as Tabs } from 'components';
import { UiType } from 'components/Tabs/Tabs.types';
import { StyledModalWrapper } from 'styles/styledComponents/Modal';
import theme from 'styles/theme';

import { ActivityFormProps, ActivityFormRef, FormValues } from '.';
import { tabs, defaultValues, activities } from './ActivityForm.const';

export const ActivityForm = forwardRef<ActivityFormRef, ActivityFormProps>(
  (
    { setRemoveAllEventsPopupVisible, setConfirmScheduledAccessPopupVisible, submitCallback },
    ref,
  ) => {
    const { t } = useTranslation('app');

    const methods = useForm<FormValues>({
      defaultValues,
      mode: 'onChange',
    });

    const {
      getValues,
      handleSubmit,
      control,
      formState: { dirtyFields },
    } = methods;

    const submitForm = () => {
      if (dirtyFields.availability) {
        if (getValues().availability) {
          setRemoveAllEventsPopupVisible(true);
        } else {
          setConfirmScheduledAccessPopupVisible(true);
        }
      }

      submitCallback();
    };

    useImperativeHandle(ref, () => ({
      submitForm() {
        handleSubmit(submitForm)();
      },
    }));

    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submitForm)} noValidate autoComplete="off">
          <StyledModalWrapper sx={{ mb: theme.spacing(2) }}>
            <SelectController
              fullWidth
              name="activity"
              control={control}
              options={activities}
              label={t('activity')}
              required
            />
          </StyledModalWrapper>
          <Tabs tabs={tabs} uiType={UiType.Secondary} />
        </form>
      </FormProvider>
    );
  },
);
