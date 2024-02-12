import { useEffect, useState, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import get from 'lodash.get';

import { StyledFlexSpaceBetween, StyledFlexTopCenter, StyledTitleMedium, theme } from 'shared/styles';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { CorrectPress, FlankerItemPositions } from 'modules/Builder/types';
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
  const [activeButton, setActiveButton] = useState<ButtonsQuantity>(ButtonsQuantity.Two);
  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useCustomFormContext();
  const { fieldName, activityObjField } = useCurrentActivity();
  const buttonsField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.buttons`;
  const itemButtons: FlankerButtonSetting[] = watch(buttonsField);

  const buttonFirstField = `${buttonsField}.0`;
  const buttonSecondField = `${buttonsField}.1`;
  const buttonNameFirst = watch(`${buttonFirstField}.text`);
  const buttonNameFirstRef = useRef<string | null>(null);
  const buttonNameSecond = watch(`${buttonSecondField}.text`);
  const buttonNameSecondRef = useRef<string | null>(null);
  const dataTestid = 'builder-activity-flanker-buttons';

  const handleActiveBtnChange = (activeValue: string | number) => {
    setActiveButton(activeValue as ButtonsQuantity);
    const firstBtnObj = itemButtons[0];
    setValue(
      buttonsField,
      activeValue === ButtonsQuantity.One
        ? [firstBtnObj]
        : [firstBtnObj, { ...defaultFlankerBtnObj, value: CorrectPress.Right }],
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
    if (itemButtons?.length === 1) {
      setActiveButton(ButtonsQuantity.One);
    }
  }, []);

  return (
    <>
      <StyledTitleMedium sx={{ mb: theme.spacing(1.2) }}>{t('flankerButtons.number')}</StyledTitleMedium>
      <Box sx={{ width: '23.1rem', mb: theme.spacing(2.4) }}>
        <ToggleButtonGroup
          toggleButtons={buttonsQuantity}
          activeButton={activeButton}
          setActiveButton={handleActiveBtnChange}
          data-testid={`${dataTestid}-available-buttons`}
        />
      </Box>
      <StyledFlexSpaceBetween>
        {itemButtons?.map((button, index) => {
          const currentBtnField = `${buttonsField}.${index}`;
          const currentBtnFieldImg = `${currentBtnField}.image`;
          const currentBtnFieldName = `${currentBtnField}.text`;
          const currentDataTestid = `${dataTestid}-${index}`;

          return (
            <StyledRowWrapper key={index}>
              <StyledFlexTopCenter sx={{ mr: theme.spacing(0.8) }}>
                <Uploader
                  uiType={UploaderUiType.Tertiary}
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
                  data-testid={`${currentDataTestid}-image`}
                />
              </StyledFlexTopCenter>
              <InputController
                control={control}
                fullWidth
                key={currentBtnFieldName}
                name={currentBtnFieldName}
                label={getButtonLabel(itemButtons.length, index)}
                maxLength={SMALL_INPUT_LENGTH}
                restrictExceededValueLength
                disabled={!!button.image}
                data-testid={`${currentDataTestid}-text`}
              />
            </StyledRowWrapper>
          );
        })}
      </StyledFlexSpaceBetween>
    </>
  );
};
