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
import { FlankerItemPositions } from 'modules/Builder/types';
import { ToggleButtonGroup, Uploader, UploaderUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { SMALL_INPUT_LENGTH } from 'shared/consts';
import { FlankerButtonSetting } from 'shared/state';
import { defaultFlankerBtnObj } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';

import { ButtonsQuantity, buttonsQuantity } from './ButtonsContent.const';
import { getButtonLabel } from './ButtonsContent.utils';
import { StyledRowWrapper } from './ButtonsContent.styles';

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
  const { fieldName, activityObjField } = useCurrentActivity();
  const firstItemButtonsField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.buttons`;
  const firstItemButtons: FlankerButtonSetting[] = watch(firstItemButtonsField);

  const buttonFirstField = `${firstItemButtonsField}.0`;
  const buttonSecondField = `${firstItemButtonsField}.1`;
  const buttonNameFirst = watch(`${buttonFirstField}.text`);
  const buttonNameFirstRef = useRef<string | null>(null);
  const buttonNameSecond = watch(`${buttonSecondField}.text`);
  const buttonNameSecondRef = useRef<string | null>(null);

  const handleActiveBtnChange = (activeValue: string) => {
    setActiveButton(activeValue as ButtonsQuantity);
    const firstBtnObj = firstItemButtons[0];
    setValue(
      firstItemButtonsField,
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

  useEffect(() => {
    if (firstItemButtons?.length === 2) {
      setActiveButton(ButtonsQuantity.Two);
    }
  }, []);

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
        {firstItemButtons?.map((button, index) => {
          const currentBtnField = `${firstItemButtonsField}.${index}`;
          const currentBtnFieldImg = `${currentBtnField}.image`;
          const currentBtnFieldName = `${currentBtnField}.text`;

          return (
            <StyledRowWrapper key={index}>
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
                    !!get(
                      errors,
                      `${activityObjField}.items[${FlankerItemPositions.PracticeFirst}].config.buttons[${index}].image`,
                    )
                  }
                  disabled={!!button.text}
                />
              </StyledFlexTopCenter>
              <InputController
                control={control}
                fullWidth
                name={currentBtnFieldName}
                label={getButtonLabel(firstItemButtons.length, index)}
                maxLength={SMALL_INPUT_LENGTH}
                restrictExceededValueLength
                disabled={!!button.image}
              />
            </StyledRowWrapper>
          );
        })}
      </StyledFlexSpaceBetween>
    </>
  );
};
