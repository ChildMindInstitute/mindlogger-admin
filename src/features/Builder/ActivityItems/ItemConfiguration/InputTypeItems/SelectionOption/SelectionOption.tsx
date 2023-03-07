import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg, Uploader, UploaderUiType } from 'components';
import { InputController } from 'components/FormComponents';
import theme from 'styles/theme';
import {
  StyledBodyLarge,
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
} from 'styles/styledComponents';

import { ItemConfigurationForm } from '../../ItemConfiguration.types';
import {
  StyledAction,
  StyledCollapsedWrapper,
  StyledItemOption,
  StyledTooltipWrapper,
} from './SelectionOption.styles';
import { SelectionOptionProps } from './SelectionOption.types';
import { OPTION_TEXT_MAX_LENGTH } from './SelectionOption.const';

export const SelectionOption = ({
  text,
  onRemoveOption,
  isVisible,
  index,
}: SelectionOptionProps) => {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(true);
  const { setValue, watch, control } = useFormContext<ItemConfigurationForm>();

  // const settings = watch('settings');
  const handleOptionToggle = () => setOpen((prevState) => !prevState);
  const handleOptionHide = () => setValue(`options.${index}.isVisible`, !isVisible);
  const handlePaletteClick = () => console.log('palette click');

  const imageComponent = (
    <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
      <Uploader
        uiType={UploaderUiType.Secondary}
        width={5.6}
        height={5.6}
        setValue={(val: string) => setValue(`options.${index}.image`, val)}
        getValue={() => watch(`options.${index}.image`) || ''}
      />
    </StyledFlexTopCenter>
  );

  const commonInputProps = {
    control,
    fullWidth: true,
  };

  return (
    <StyledItemOption>
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
          <StyledClearedButton onClick={handleOptionToggle}>
            <Svg id={open ? 'navigate-up' : 'navigate-down'} />
          </StyledClearedButton>
          <StyledLabelBoldLarge sx={{ ml: theme.spacing(2) }}>{`${t('option')} ${
            index + 1
          }`}</StyledLabelBoldLarge>
          {!open && (
            <StyledCollapsedWrapper>
              <Svg id="radio-button-outline" />
              {imageComponent}
              {text && <StyledBodyLarge>{text}</StyledBodyLarge>}
            </StyledCollapsedWrapper>
          )}
        </StyledFlexTopCenter>
        <StyledFlexTopCenter>
          <StyledAction onClick={handleOptionHide}>
            <Svg id={isVisible ? 'visibility-on' : 'visibility-off'} />
          </StyledAction>
          <StyledAction onClick={handlePaletteClick}>
            <Svg id="paint-outline" />
          </StyledAction>
          <StyledAction onClick={() => onRemoveOption(index)}>
            <Svg id="trash" />
          </StyledAction>
        </StyledFlexTopCenter>
      </StyledFlexTopCenter>
      {open && (
        <StyledFlexColumn>
          <StyledFlexTopCenter sx={{ m: theme.spacing(1.5, 0, 2.4) }}>
            <StyledFlexTopCenter sx={{ mr: theme.spacing(2.4) }}>
              <Svg id="radio-button-outline" />
            </StyledFlexTopCenter>
            {imageComponent}
            <Box sx={{ width: '49.2rem', m: theme.spacing(1) }}>
              <InputController
                name={`options.${index}.text`}
                label={t('optionText')}
                maxLength={OPTION_TEXT_MAX_LENGTH}
                {...commonInputProps}
              />
            </Box>
            <InputController
              name={`options.${index}.score`}
              type="number"
              label={t('score')}
              {...commonInputProps}
              // InputProps={{ inputProps: { min: 1 } }}
            />
          </StyledFlexTopCenter>
          <StyledTooltipWrapper>
            <InputController fullWidth name={`options.${index}.tooltip`} control={control} />
            <StyledBodyMedium>{t('supportingText')}</StyledBodyMedium>
          </StyledTooltipWrapper>
        </StyledFlexColumn>
      )}
    </StyledItemOption>
  );
};
