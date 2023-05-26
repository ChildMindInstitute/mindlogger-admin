import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import {
  StyledFlexSpaceBetween,
  StyledFlexTopCenter,
  StyledTitleMedium,
  theme,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ToggleButtonGroup, Uploader, UploaderUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { SMALL_INPUT_LENGTH } from 'shared/consts';
import { FlankerButtonSetting } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';
import { defaultFlankerBtnObj } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';

import { ButtonsQuantity, buttonsQuantity } from './ButtonsContent.const';
import { getButtonLabel } from './ButtonsContent.utils';

export const ButtonsContent = () => {
  const { t } = useTranslation();
  const [activeButton, setActiveButton] = useState<ButtonsQuantity>(ButtonsQuantity.One);
  const { control, watch, setValue } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const buttonsField = `${fieldName}.general.buttons`;
  const buttons: FlankerButtonSetting[] = watch(buttonsField);

  const handleActiveBtnChange = (activeValue: string) => {
    setActiveButton(activeValue as ButtonsQuantity);
    const firstBtnObj = buttons[0];
    setValue(
      buttonsField,
      activeValue === ButtonsQuantity.One ? [firstBtnObj] : [firstBtnObj, defaultFlankerBtnObj],
    );
  };

  return (
    <>
      <StyledTitleMedium sx={{ mb: theme.spacing(1.2) }}>
        {t('flankerButtons.number')}
      </StyledTitleMedium>
      <Box sx={{ width: '23.1rem', mb: theme.spacing(2.4) }}>
        <ToggleButtonGroup
          toggleButtons={buttonsQuantity}
          activeButton={activeButton}
          setActiveButton={handleActiveBtnChange}
        />
      </Box>
      <StyledFlexSpaceBetween>
        {buttons?.map((button, index) => (
          <StyledFlexSpaceBetween
            key={index}
            sx={{
              mb: theme.spacing(2),
              flex: '0 0 calc(50% - 1.2rem)',
            }}
          >
            <StyledFlexTopCenter sx={{ mr: theme.spacing(0.8) }}>
              <Uploader
                uiType={UploaderUiType.Secondary}
                width={5.6}
                height={5.6}
                setValue={(val: string) =>
                  setValue(`${buttonsField}.${index}.image`, val || undefined)
                }
                getValue={() => button.image || ''}
              />
            </StyledFlexTopCenter>
            <InputController
              control={control}
              fullWidth
              name={`${buttonsField}.${index}.name`}
              label={getButtonLabel(buttons.length, index)}
              maxLength={SMALL_INPUT_LENGTH}
              restrictExceededValueLength
            />
          </StyledFlexSpaceBetween>
        ))}
      </StyledFlexSpaceBetween>
    </>
  );
};
