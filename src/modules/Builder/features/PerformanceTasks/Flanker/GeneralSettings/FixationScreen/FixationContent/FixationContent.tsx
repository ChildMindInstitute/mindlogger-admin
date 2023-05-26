import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { StyledFlexTopCenter, StyledTitleMedium, theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { Svg, Uploader, UploaderUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { FlankerFixationSettings } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';

import { StyledAddButton } from '../../GeneralSettings.styles';
import { DEFAULT_FIXATION_DURATION, MIN_FIXATION_DURATION } from './FixationContent.const';
import { StyledRemoveButton, StyledInputContainer } from './FixationContent.styles';

export const FixationContent = () => {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const fixationField = `${fieldName}.general.fixation`;
  const fixation: FlankerFixationSettings = watch(fixationField);

  const handleFixationAdd = () => {
    setValue(fixationField, { image: '', duration: DEFAULT_FIXATION_DURATION });
  };

  const handleFixationRemove = () => {
    setValue(fixationField, null);
  };

  return fixation ? (
    <>
      <StyledFlexTopCenter sx={{ mb: theme.spacing(2.4), justifyContent: 'space-between' }}>
        <StyledFlexTopCenter>
          <Uploader
            uiType={UploaderUiType.Secondary}
            width={5.6}
            height={5.6}
            setValue={(val: string) => setValue(`${fixationField}.image`, val || undefined)}
            getValue={() => fixation?.image || ''}
            showImgName
          />
        </StyledFlexTopCenter>
        <StyledRemoveButton onClick={handleFixationRemove}>
          <Svg id="cross" width="1.8rem" height="1.8rem" />
        </StyledRemoveButton>
      </StyledFlexTopCenter>
      <StyledFlexTopCenter sx={{ mb: theme.spacing(1) }}>
        <StyledTitleMedium>{t('flankerFixation.showFixationFor')}</StyledTitleMedium>
        <StyledInputContainer>
          <InputController
            control={control}
            name={`${fixationField}.duration`}
            type="number"
            minNumberValue={MIN_FIXATION_DURATION}
          />
        </StyledInputContainer>
        <StyledTitleMedium>{t('flankerFixation.milliseconds')}</StyledTitleMedium>
      </StyledFlexTopCenter>
    </>
  ) : (
    <Box>
      <StyledAddButton
        onClick={handleFixationAdd}
        startIcon={<Svg id="add" width="1.8rem" height="1.8rem" />}
        variant="text"
      >
        {t('flankerFixation.addBtn')}
      </StyledAddButton>
    </Box>
  );
};
