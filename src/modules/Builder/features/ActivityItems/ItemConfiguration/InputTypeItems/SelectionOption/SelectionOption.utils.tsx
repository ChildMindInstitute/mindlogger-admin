import { UseFormSetValue } from 'react-hook-form';

import { Svg, Uploader, UploaderUiType } from 'shared/components';
import { StyledFlexTopCenter, theme } from 'shared/styles';

import { ItemConfigurationForm } from '../../ItemConfiguration.types';
import { OptionActions } from './SelectionOption.types';

export const getActions = ({
  actions: { optionHide, paletteClick, optionRemove },
  isHidden,
  hasColorPicker,
  isColorSet,
  optionsLength,
}: OptionActions) => [
  {
    icon: <Svg id={!isHidden ? 'visibility-on' : 'visibility-off'} />,
    action: optionHide,
  },
  {
    icon: <Svg id={isColorSet ? 'paint-filled' : 'paint-outline'} />,
    action: paletteClick,
    isDisplayed: hasColorPicker,
    active: isColorSet,
  },
  {
    icon: <Svg id="trash" />,
    isDisplayed: optionsLength > 1,
    action: optionRemove,
  },
];

export const getUploaderComponent = (
  setValue: UseFormSetValue<ItemConfigurationForm>,
  index: number,
  imageSrc?: string,
) => (
  <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
    <Uploader
      uiType={UploaderUiType.Secondary}
      width={5.6}
      height={5.6}
      setValue={(val: string) => setValue(`options.${index}.image`, val)}
      getValue={() => imageSrc || ''}
    />
  </StyledFlexTopCenter>
);
