import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';
import get from 'lodash.get';

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
import { FlankerButtonSetting } from 'shared/state';
import { defaultFlankerBtnObj } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';

import { ButtonsQuantity, buttonsQuantity } from './ButtonsContent.const';
import { getButtonLabel } from './ButtonsContent.utils';

export const ButtonsContent = () => {
  const { t } = useTranslation();
  const [activeButton, setActiveButton] = useState<ButtonsQuantity>(ButtonsQuantity.One);
  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const { perfTaskItemField, perfTaskItemObjField } = useCurrentActivity();
  const buttonsField = `${perfTaskItemField}.general.buttons`;
  const buttons: FlankerButtonSetting[] = watch(buttonsField);

  const buttonFirstField = `${buttonsField}.0`;
  const buttonSecondField = `${buttonsField}.1`;
  const buttonNameFirst = watch(`${buttonFirstField}.name`);
  const buttonNameFirstRef = useRef<string | null>(null);
  const buttonNameSecond = watch(`${buttonSecondField}.name`);
  const buttonNameSecondRef = useRef<string | null>(null);

  const handleActiveBtnChange = (activeValue: string) => {
    setActiveButton(activeValue as ButtonsQuantity);
    const firstBtnObj = buttons[0];
    setValue(
      buttonsField,
      activeValue === ButtonsQuantity.One ? [firstBtnObj] : [firstBtnObj, defaultFlankerBtnObj],
    );
  };

  useEffect(() => {
    if (buttonNameFirstRef.current || buttonNameFirst) {
      trigger([`${buttonFirstField}.image`]);
    }
    buttonNameFirstRef.current = buttonNameFirst;
  }, [buttonNameFirst]);

  useEffect(() => {
    if (buttonNameSecondRef.current || buttonNameSecond) {
      trigger([`${buttonSecondField}.image`]);
    }
    buttonNameSecondRef.current = buttonNameSecond;
  }, [buttonNameSecond]);

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
        {buttons?.map((button, index) => {
          const currentBtnField = `${buttonsField}.${index}`;
          const currentBtnFieldImg = `${currentBtnField}.image`;
          const currentBtnFieldName = `${currentBtnField}.name`;

          return (
            <StyledFlexSpaceBetween
              key={index}
              sx={{
                mb: theme.spacing(2),
                flex: '0 0 calc(50% - 1.2rem)',
                alignItems: 'flex-start',
              }}
            >
              <StyledFlexTopCenter sx={{ mr: theme.spacing(0.8) }}>
                <Uploader
                  uiType={UploaderUiType.Secondary}
                  width={5.6}
                  height={5.6}
                  setValue={(val: string) => {
                    setValue(currentBtnFieldImg, val || undefined);
                    trigger([currentBtnFieldImg, currentBtnFieldName]);
                  }}
                  getValue={() => button.image || ''}
                  hasError={
                    !!get(errors, `${perfTaskItemObjField}.general.buttons[${index}].image`)
                  }
                />
              </StyledFlexTopCenter>
              <InputController
                control={control}
                fullWidth
                name={currentBtnFieldName}
                label={getButtonLabel(buttons.length, index)}
                maxLength={SMALL_INPUT_LENGTH}
                restrictExceededValueLength
              />
            </StyledFlexSpaceBetween>
          );
        })}
      </StyledFlexSpaceBetween>
    </>
  );
};
