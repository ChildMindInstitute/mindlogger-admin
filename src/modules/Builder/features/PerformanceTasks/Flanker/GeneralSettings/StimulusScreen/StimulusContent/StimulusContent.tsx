import { useState } from 'react';
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
import { FlankerStimulusSettings } from 'shared/state';
import { CorrectPress } from 'modules/Builder/types';
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
  const { perfTaskItemField, perfTaskItemObjField } = useCurrentActivity();
  const [screenToDelete, setScreenToDelete] = useState<null | { index: number; imageName: string }>(
    null,
  );
  const stimulusObjField = `${perfTaskItemObjField}.general.stimulusTrials`;
  const stimulusField = `${perfTaskItemField}.general.stimulusTrials`;
  const stimulusTrials: FlankerStimulusSettings[] = watch(stimulusField);
  const hasStimulusErrors = !!get(errors, stimulusObjField);

  const { append, remove, update } = useFieldArray({
    control,
    name: stimulusField,
  });

  const handleStimulusAdd = () =>
    append({ id: uuidv4(), image: '', correctPress: CorrectPress.Left });

  const handleStimulusDelete = () => {
    if (!screenToDelete) return;
    remove(screenToDelete.index);
    setScreenToDelete(null);
    clearErrors(stimulusField);
  };

  const handleSetScreenToDelete = (index: number, imageName: string) => () => {
    setScreenToDelete({ index, imageName });
  };

  const handleActiveBtnChange = (value: string, index: number) => {
    update(index, {
      ...stimulusTrials[index],
      correctPress: value,
    });
  };

  return (
    <>
      <StyledWrapper>
        {stimulusTrials?.length ? (
          <StyledHeader>
            <StyledBodyMedium color={variables.palette.outline} sx={{ flex: '0 0 45%' }}>
              {t('flankerStimulus.fileName')}
            </StyledBodyMedium>
            <StyledBodyMedium color={variables.palette.outline} sx={{ flex: '0 0 55%' }}>
              {t('flankerStimulus.correctPress')}
            </StyledBodyMedium>
          </StyledHeader>
        ) : (
          <StyledInfoSection>
            <StyledBodyLarge color={variables.palette.outline}>
              {t('flankerStimulus.addText')}
            </StyledBodyLarge>
          </StyledInfoSection>
        )}
        {stimulusTrials?.map((trial, index) => {
          const imageName = getUploadedMediaName(trial.image);
          const imageField = `${stimulusField}.${index}.image`;
          const hasImgError = !!get(errors, `${stimulusObjField}[${index}].image`);

          return (
            <StyledRow key={trial.id}>
              <Box sx={{ flex: '0 0 45%' }}>
                <StyledFlexTopCenter>
                  <Uploader
                    uiType={UploaderUiType.Secondary}
                    width={5.6}
                    height={5.6}
                    setValue={(val: string) => {
                      setValue(imageField, val ?? '');
                      trigger([stimulusField]);
                    }}
                    getValue={() => trial.image || ''}
                    hasError={hasImgError}
                  />
                  {imageName && (
                    <StyledBodyLarge
                      sx={{ ml: theme.spacing(1) }}
                      color={variables.palette.on_surface_variant}
                    >
                      {imageName}
                    </StyledBodyLarge>
                  )}
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
                <Box sx={{ width: '18.3rem' }}>
                  <ToggleButtonGroup
                    toggleButtons={pressOptions}
                    activeButton={trial.correctPress}
                    setActiveButton={(value: string) => handleActiveBtnChange(value, index)}
                    haveEqualWidth
                  />
                </Box>
              </Box>
              <StyledFlexTopCenter sx={{ justifyContent: 'flex-end', flex: '0 0 10%' }}>
                <StyledRemoveButton onClick={handleSetScreenToDelete(index, imageName)}>
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
