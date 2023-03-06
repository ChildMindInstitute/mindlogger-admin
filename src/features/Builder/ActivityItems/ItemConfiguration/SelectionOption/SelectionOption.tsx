import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import theme from 'styles/theme';
import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
} from 'styles/styledComponents';

import { StyledItemOption } from './SelectionOption.styles';
import { SelectionOptionProps } from './SelectionOption.types';

export const SelectionOption = ({
  text,
  score,
  tooltip,
  removeOption,
  isVisible,
  index,
}: SelectionOptionProps) => {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(true);

  const handleOptionToggle = () => setOpen((prevState) => !prevState);
  const handleHideOption = () => console.log('hide option');

  return (
    <StyledItemOption>
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <StyledFlexTopCenter sx={{ mr: theme.spacing(1) }}>
          <StyledClearedButton onClick={handleOptionToggle}>
            <Svg id={open ? 'navigate-up' : 'navigate-down'} />
          </StyledClearedButton>
          <StyledLabelBoldLarge>{`${t('option')} ${index + 1}`}</StyledLabelBoldLarge>
        </StyledFlexTopCenter>
        <StyledFlexTopCenter>
          <StyledClearedButton onClick={handleHideOption}>
            <Svg id={isVisible ? 'visibility-on' : 'visibility-off'} />
          </StyledClearedButton>
        </StyledFlexTopCenter>
      </StyledFlexTopCenter>
    </StyledItemOption>
  );
};
