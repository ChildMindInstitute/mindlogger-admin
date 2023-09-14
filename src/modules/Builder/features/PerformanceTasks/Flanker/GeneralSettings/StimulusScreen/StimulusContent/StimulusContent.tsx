import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Box } from '@mui/material';
import get from 'lodash.get';

import {
  theme,
  StyledBodyLarge,
  StyledBodyMedium,
  StyledFlexTopCenter,
  variables,
  StyledSvgPrimaryColorBtn,
} from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { Svg, ToggleButtonGroup, Uploader, UploaderUiType } from 'shared/components';
import { FlankerButtonSetting, FlankerStimulusSettings } from 'shared/state';
import { CorrectPress, FlankerItemPositions } from 'modules/Builder/types';
import { getUploadedMediaName, getIsRequiredValidateMessage } from 'shared/utils';

import { DeleteStimulusPopup } from './DeleteStimulusPopup';
import { pressOptions } from './StimulusContent.const';
import {
  StyledBtmSection,
  StyledRemoveButton,
  StyledInfoSection,
  StyledWrapper,
  StyledHeader,
  StyledRow,
  StyledFileName,
} from './StimulusContent.styles';

export const StimulusContent = () => {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
    clearErrors,
  } = useFormContext();
  const { fieldName, activityObjField } = useCurrentActivity();
  const [screenToDelete, setScreenToDelete] = useState<null | { index: number; imageName: string }>(
    null,
  );
  const stimulusObjField = `${activityObjField}.items[${FlankerItemPositions.PracticeFirst}].config.stimulusTrials`;
  const stimulusField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.stimulusTrials`;
  const buttonsField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.buttons`;
  const buttons: FlankerButtonSetting[] = watch(buttonsField);
  const hasTwoButtons = buttons?.length === 2;
  const stimulusTrials: FlankerStimulusSettings[] = watch(stimulusField);
  const hasStimulusErrors = !!get(errors, stimulusObjField);
  const dataTestid = 'builder-activity-flanker-stimulus-screen';

  const { append, remove, update } = useFieldArray({
    control,
    name: stimulusField,
  });

  const handleStimulusAdd = () =>
    append({ id: uuidv4(), image: '', text: '', value: CorrectPress.Left });

  const handleStimulusDelete = () => {
    if (!screenToDelete) return;
    remove(screenToDelete.index);
    setScreenToDelete(null);
    clearErrors(stimulusField);
  };

  const handleSetScreenToDelete = (index: number, imageName: string) => () => {
    setScreenToDelete({ index, imageName });
  };

  const handleActiveBtnChange = (value: string | number, index: number) => {
    update(index, {
      ...stimulusTrials[index],
      value,
    });
  };

  useEffect(() => {
    if (hasTwoButtons) return;

    const newTrials = stimulusTrials?.map((trial) => ({
      ...trial,
      value: CorrectPress.Left,
    }));
    setValue(stimulusField, newTrials);
  }, [hasTwoButtons]);

  return (
    <>
      <StyledWrapper>
        {stimulusTrials?.length ? (
          <StyledHeader>
            <StyledBodyMedium color={variables.palette.outline} sx={{ flex: '0 0 45%' }}>
              {t('flankerStimulus.fileName')}
            </StyledBodyMedium>
            <StyledBodyMedium color={variables.palette.outline} sx={{ flex: '0 0 55%' }}>
              {hasTwoButtons ? t('flankerStimulus.correctPress') : ''}
            </StyledBodyMedium>
          </StyledHeader>
        ) : (
          <StyledInfoSection>
            <StyledBodyLarge color={variables.palette.outline}>
              {t('flankerStimulus.addText')}
            </StyledBodyLarge>
          </StyledInfoSection>
        )}
        {stimulusTrials?.map(({ id, image, text, value }, index) => {
          const imageField = `${stimulusField}.${index}.image`;
          const textField = `${stimulusField}.${index}.text`;
          const hasImgError = !!get(errors, `${stimulusObjField}[${index}].image`);
          const currentDataTestid = `${dataTestid}-${index}`;

          return (
            <StyledRow key={id}>
              <Box sx={{ flex: '0 0 45%' }}>
                <StyledFlexTopCenter>
                  <Uploader
                    uiType={UploaderUiType.Secondary}
                    width={5.6}
                    height={5.6}
                    setValue={(val: string) => {
                      setValue(imageField, val ?? '');
                      setValue(textField, val ? getUploadedMediaName(val) : '');
                      trigger([stimulusField]);
                    }}
                    getValue={() => image || ''}
                    hasError={hasImgError}
                    data-testid={`${currentDataTestid}-image`}
                  />
                  {text && <StyledFileName>{text}</StyledFileName>}
                </StyledFlexTopCenter>
                {hasImgError && (
                  <StyledBodyMedium
                    sx={{ pt: theme.spacing(0.5) }}
                    color={variables.palette.semantic.error}
                  >
                    {getIsRequiredValidateMessage('flankerStimulus.fileName')}
                  </StyledBodyMedium>
                )}
              </Box>
              <Box sx={{ flex: '0 0 45%' }}>
                {hasTwoButtons && !!image && (
                  <Box sx={{ width: '18.3rem' }}>
                    <ToggleButtonGroup
                      toggleButtons={pressOptions}
                      activeButton={value}
                      setActiveButton={(activeValue: string | number) =>
                        handleActiveBtnChange(activeValue, index)
                      }
                      data-testid={`${currentDataTestid}-correct-buttons`}
                    />
                  </Box>
                )}
              </Box>
              <StyledFlexTopCenter sx={{ justifyContent: 'flex-end', flex: '0 0 10%' }}>
                <StyledRemoveButton
                  onClick={handleSetScreenToDelete(index, text)}
                  data-testid={`${currentDataTestid}-remove`}
                >
                  <Svg id="cross" width="1.8rem" height="1.8rem" />
                </StyledRemoveButton>
              </StyledFlexTopCenter>
            </StyledRow>
          );
        })}
        <StyledBtmSection>
          <StyledSvgPrimaryColorBtn
            onClick={handleStimulusAdd}
            startIcon={<Svg id="add" width="1.8rem" height="1.8rem" />}
            variant="text"
            data-testid={`${dataTestid}-add`}
          >
            {t('flankerStimulus.addBtn')}
          </StyledSvgPrimaryColorBtn>
        </StyledBtmSection>
        {screenToDelete && (
          <DeleteStimulusPopup
            imageName={screenToDelete.imageName}
            isOpen={!!screenToDelete}
            onModalClose={() => setScreenToDelete(null)}
            onModalSubmit={handleStimulusDelete}
          />
        )}
      </StyledWrapper>
      {hasStimulusErrors && (
        <StyledBodyMedium sx={{ pt: theme.spacing(2.4) }} color={variables.palette.semantic.error}>
          {t('fillInAllRequired')}
        </StyledBodyMedium>
      )}
    </>
  );
};
