import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useFieldArray } from 'react-hook-form';
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
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { Svg, ToggleButtonGroup, Uploader, UploaderUiType } from 'shared/components';
import { FlankerButtonSetting, FlankerStimulusSettings } from 'shared/state';
import { CorrectPress, FlankerItemPositions } from 'modules/Builder/types';
import { getIsRequiredValidateMessage } from 'shared/utils';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import { getUploadedMediaName } from 'modules/Builder/utils';

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
    trigger,
    formState: { errors },
    clearErrors,
    reset,
  } = useCustomFormContext();
  const { fieldName, activityObjField } = useCurrentActivity();
  const [screenToDelete, setScreenToDelete] = useState<null | { index: number; imageName: string }>(
    null,
  );
  const stimulusObjField = `${activityObjField}.items[${FlankerItemPositions.PracticeFirst}].config.stimulusTrials`;
  const stimulusField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.stimulusTrials`;
  const buttonsField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.buttons`;
  const buttons: FlankerButtonSetting[] = watch(buttonsField);
  const hasTwoButtons = buttons?.length === 2;
  const hasStimulusErrors = !!get(errors, stimulusObjField);
  const correctPressText = hasTwoButtons ? t('flankerStimulus.correctPress') : '';
  const dataTestid = 'builder-activity-flanker-stimulus-screen';

  const {
    fields: stimulusTrials,
    append,
    remove,
    update,
    replace,
  } = useFieldArray<
    Record<string, FlankerStimulusSettings[]>,
    string,
    typeof REACT_HOOK_FORM_KEY_NAME
  >({
    control,
    name: stimulusField,
    keyName: REACT_HOOK_FORM_KEY_NAME,
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
    } as FlankerStimulusSettings);
  };

  useEffect(() => {
    if (hasTwoButtons) return;

    const newTrials = stimulusTrials?.map((trial) => ({
      ...trial,
      value: CorrectPress.Left,
    }));
    replace(newTrials);
  }, [hasTwoButtons]);

  useEffect(() => {
    if (fieldName === undefined) {
      //reset is dirty state if fieldName is not defined (after the first publish of the Flanker)
      reset(undefined, { keepDirty: false });
    }
  }, [fieldName]);

  return (
    <>
      <StyledWrapper>
        {stimulusTrials?.length ? (
          <StyledHeader>
            <StyledBodyMedium color={variables.palette.outline} sx={{ flex: '0 0 45%' }}>
              {t('flankerStimulus.fileName')}
            </StyledBodyMedium>
            <StyledBodyMedium color={variables.palette.outline} sx={{ flex: '0 0 55%' }}>
              {correctPressText}
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
          const { id, image, text, value } = trial;
          const hasImgError = !!get(errors, `${stimulusObjField}[${index}].image`);
          const currentDataTestid = `${dataTestid}-${index}`;

          return (
            <StyledRow key={id}>
              <Box sx={{ flex: '0 0 45%' }}>
                <StyledFlexTopCenter>
                  <Uploader
                    uiType={UploaderUiType.Tertiary}
                    width={5.6}
                    height={5.6}
                    setValue={(image: string) => {
                      update(index, {
                        ...trial,
                        image,
                        text: getUploadedMediaName(image),
                      });
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
                {hasTwoButtons && (!!image || !!text) && (
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
