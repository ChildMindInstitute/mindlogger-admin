import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectController } from 'components/FormComponents';
import { CheckboxController } from 'components/FormComponents';
import { TimePicker, DatePicker, UiType, ToggleButtonGroup } from 'components';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { availabilityOptions, repeatsButtons, Repeats } from './Availability.const';
import { defaultValues } from '../CreateActivityPopup.const';
import { ConnectForm } from '../context';
import { StyledButtonsTitle, StyledTimeWrapper, StyledWrapper } from './Availability.styles';

export const Availability = () => {
  const { t } = useTranslation('app');
  const [activeRepeat, setActiveRepeat] = useState<string>(Repeats.once);

  return (
    <ConnectForm>
      {({ control, watch, reset, getValues, register, unregister }) => {
        const availability = watch('availability');

        const updateDateFieled = (val: string) => {
          if (val !== Repeats.once) {
            unregister('date');
            register('startEndingDate', { value: '' });
          } else {
            unregister('startEndingDate');
            register('date', { value: '' });
          }
        };

        const availabilityOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          reset({
            ...defaultValues,
            availability: e.target.value,
            activity: getValues('activity'),
          });
        };

        return (
          <>
            <SelectController
              name="availability"
              fullWidth
              options={availabilityOptions}
              label=""
              control={control}
              customChange={availabilityOnChange}
            />
            {availability ? (
              <StyledWrapper>
                <CheckboxController
                  name="completion"
                  control={control}
                  label={<StyledBodyMedium>{t('oneTimeCompletion')}</StyledBodyMedium>}
                />
              </StyledWrapper>
            ) : (
              <>
                <StyledWrapper>
                  <StyledButtonsTitle>{t('usersCanAccessActivity')}</StyledButtonsTitle>
                  <ToggleButtonGroup
                    toggleButtons={repeatsButtons}
                    activeButton={activeRepeat}
                    setActiveButton={setActiveRepeat}
                    customChange={updateDateFieled}
                  />
                </StyledWrapper>
                <StyledFlexTopCenter>
                  <StyledTimeWrapper>
                    <TimePicker name="from" control={control} label={t('from')} />
                  </StyledTimeWrapper>
                  <TimePicker name="to" control={control} label={t('to')} />
                </StyledFlexTopCenter>
                <StyledWrapper>
                  <CheckboxController
                    name="timeout.access"
                    control={control}
                    label={<StyledBodyMedium>{t('allowAccessBeforeTime')}</StyledBodyMedium>}
                  />
                </StyledWrapper>
                {activeRepeat !== Repeats.once ? (
                  <DatePicker
                    name="startEndingDate"
                    control={control}
                    uiType={UiType.startEndingDate}
                  />
                ) : (
                  <DatePicker name="date" control={control} uiType={UiType.oneDate} />
                )}
              </>
            )}
          </>
        );
      }}
    </ConnectForm>
  );
};
