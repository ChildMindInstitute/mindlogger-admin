import { Box } from '@mui/material';
import get from 'lodash.get';
import { useTranslation } from 'react-i18next';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { FlankerItemPositions } from 'modules/Builder/types';
import { getUploadedMediaName } from 'modules/Builder/utils';
import { Svg, Uploader, UploaderUiType } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { DEFAULT_MILLISECONDS_DURATION, MIN_MILLISECONDS_DURATION } from 'shared/consts';
import {
  StyledBodyLarge,
  StyledBodySmall,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledSmallNumberInput,
  StyledSvgPrimaryColorBtn,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { getIsRequiredValidateMessage } from 'shared/utils';

import { StyledRemoveButton } from './FixationContent.styles';

export const FixationContent = () => {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
    clearErrors,
  } = useCustomFormContext();
  const { fieldName, activityObjField } = useCurrentActivity();
  const fixationImageField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.fixationScreen`;
  const fixationDurationField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.fixationDuration`;
  const fixationShowField = `${fieldName}.items.${FlankerItemPositions.PracticeFirst}.config.showFixation`;
  const fixationImage = watch(fixationImageField);
  const fixationShow = watch(fixationShowField);
  const imgErrorPath = `${activityObjField}.items[${FlankerItemPositions.PracticeFirst}].config.fixationScreen`;
  const hasImgError = !!get(errors, imgErrorPath);
  const dataTestid = 'builder-activity-flanker-fixation-screen';

  const handleFixationAdd = () => {
    setValue(fixationImageField, { image: '', value: '' });
    setValue(fixationDurationField, DEFAULT_MILLISECONDS_DURATION);
    setValue(fixationShowField, true);
  };
  const handleFixationRemove = () => {
    setValue(fixationImageField, null);
    setValue(fixationDurationField, null);
    setValue(fixationShowField, false);
    clearErrors(fixationImageField);
  };

  const handleImageSet = (imageSrc: string) => {
    setValue(fixationImageField, { image: imageSrc || '', value: getUploadedMediaName(imageSrc) });
    trigger([fixationImageField]);
  };

  return fixationShow ? (
    <>
      <StyledFlexTopCenter sx={{ mb: theme.spacing(2.4), justifyContent: 'space-between' }}>
        <StyledFlexColumn>
          <StyledFlexTopCenter>
            <Uploader
              uiType={UploaderUiType.Tertiary}
              width={5.6}
              height={5.6}
              setValue={handleImageSet}
              getValue={() => fixationImage?.image || ''}
              hasError={hasImgError}
              data-testid={`${dataTestid}-image`}
            />
            {fixationImage?.value && (
              <StyledBodyLarge
                sx={{
                  ml: theme.spacing(1),
                  color: variables.palette.on_surface_variant,
                }}
              >
                {fixationImage.value}
              </StyledBodyLarge>
            )}
          </StyledFlexTopCenter>
          {hasImgError && (
            <StyledBodySmall sx={{ pt: theme.spacing(0.5) }} color={variables.palette.error}>
              {getIsRequiredValidateMessage('flankerFixation.fixationScreenImg')}
            </StyledBodySmall>
          )}
        </StyledFlexColumn>
        <StyledRemoveButton onClick={handleFixationRemove} data-testid={`${dataTestid}-remove`}>
          <Svg id="cross" width="1.8rem" height="1.8rem" />
        </StyledRemoveButton>
      </StyledFlexTopCenter>
      <StyledFlexTopCenter sx={{ mb: theme.spacing(1) }}>
        <StyledTitleMedium sx={{ mr: theme.spacing(0.5) }}>
          {t('flankerFixation.showFixationFor')}
        </StyledTitleMedium>
        <StyledSmallNumberInput>
          <InputController
            control={control}
            key={fixationDurationField}
            name={fixationDurationField}
            type="number"
            minNumberValue={MIN_MILLISECONDS_DURATION}
            data-testid={`${dataTestid}-duration`}
          />
        </StyledSmallNumberInput>
        <StyledTitleMedium sx={{ ml: theme.spacing(0.5) }}>{t('milliseconds')}</StyledTitleMedium>
      </StyledFlexTopCenter>
    </>
  ) : (
    <Box>
      <StyledSvgPrimaryColorBtn
        onClick={handleFixationAdd}
        startIcon={<Svg id="add" width="1.8rem" height="1.8rem" />}
        variant="text"
        data-testid={`${dataTestid}-add`}
      >
        {t('flankerFixation.addBtn')}
      </StyledSvgPrimaryColorBtn>
    </Box>
  );
};
