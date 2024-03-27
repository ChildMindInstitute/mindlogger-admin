import { StyledFlexColumn } from 'shared/styles';

import { StyledSelectionRow } from './Options.styles';
import { OptionsProps } from './Options.types';
import { StyledSelectionBox } from '../SingleMultiSelectPerRowResponseItem.styles';

export const Options = ({ options, 'data-testid': dataTestid }: OptionsProps) => (
  <StyledFlexColumn data-testid={`${dataTestid}-options`}>
    <StyledSelectionRow>
      <StyledSelectionBox data-testid={`${dataTestid}-option-0`} />
      {options.map(({ text }, index) => (
        <StyledSelectionBox key={text} data-testid={`${dataTestid}-option-${index + 1}`}>
          {text}
        </StyledSelectionBox>
      ))}
    </StyledSelectionRow>
  </StyledFlexColumn>
);
