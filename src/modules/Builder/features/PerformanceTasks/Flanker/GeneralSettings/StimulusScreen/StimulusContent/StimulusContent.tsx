import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Box } from '@mui/material';

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
import {
  CorrectPress,
  FlankerStimulusSettings,
} from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';

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
  const { control, watch, setValue } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const stimulusField = `${fieldName}.general.stimulusTrials`;
  const stimulusTrials: FlankerStimulusSettings[] = watch(stimulusField);

  const { append, remove, update } = useFieldArray({
    control,
    name: stimulusField,
  });

  const handleStimulusAdd = () =>
    append({ id: uuidv4(), image: '', imageName: '', correctPress: CorrectPress.Left });

  const handleActiveBtnChange = (value: string, index: number) => {
    update(index, {
      ...stimulusTrials[index],
      correctPress: value,
    });
  };

  return (
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
      {stimulusTrials?.map((trial, index) => (
        <StyledRow key={trial.id}>
          <StyledFlexTopCenter sx={{ flex: '0 0 45%' }}>
            <Uploader
              uiType={UploaderUiType.Secondary}
              width={5.6}
              height={5.6}
              setValue={(val: string) => setValue(`${stimulusField}.${index}.image`, val ?? '')}
              getValue={() => trial.image || ''}
              setImgOriginalName={(name: string) =>
                setValue(`${stimulusField}.${index}.imageName`, name ?? '')
              }
            />
            {trial.imageName && (
              <StyledBodyLarge
                sx={{ ml: theme.spacing(1) }}
                color={variables.palette.on_surface_variant}
              >
                {trial.imageName}
              </StyledBodyLarge>
            )}
          </StyledFlexTopCenter>
          <Box sx={{ flex: '0 0 45%' }}>
            <Box sx={{ width: '18.3rem' }}>
              <ToggleButtonGroup
                toggleButtons={pressOptions}
                activeButton={trial.correctPress}
                setActiveButton={(value: string) => handleActiveBtnChange(value, index)}
              />
            </Box>
          </Box>
          <StyledFlexTopCenter sx={{ justifyContent: 'flex-end', flex: '0 0 10%' }}>
            <StyledRemoveButton onClick={() => remove(index)}>
              <Svg id="cross" width="1.8rem" height="1.8rem" />
            </StyledRemoveButton>
          </StyledFlexTopCenter>
        </StyledRow>
      ))}
      <StyledBtmSection>
        <StyledSvgPrimaryColorBtn
          onClick={handleStimulusAdd}
          startIcon={<Svg id="add" width="1.8rem" height="1.8rem" />}
          variant="text"
        >
          {t('flankerStimulus.addBtn')}
        </StyledSvgPrimaryColorBtn>
      </StyledBtmSection>
    </StyledWrapper>
  );
};
