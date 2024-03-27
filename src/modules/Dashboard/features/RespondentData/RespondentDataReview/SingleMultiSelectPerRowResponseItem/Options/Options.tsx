import { StyledFlexColumn } from 'shared/styles';

import { StyledSelectionRow } from './Options.styles';
import { OptionsProps } from './Options.types';
import { StyledSelectionBox } from '../SingleMultiSelectPerRowResponseItem.styles';

export const Options = ({ options, 'data-testid': dataTestid }: OptionsProps) => (
  <StyledFlexColumn>
    <StyledSelectionRow>
      <StyledSelectionBox data-testid={`${dataTestid}-options-0`} />
      {options.map(({ text }, index) => (
        <StyledSelectionBox key={text} data-testid={`${dataTestid}-options-${index + 1}`}>
          {text}
        </StyledSelectionBox>
      ))}
    </StyledSelectionRow>
  </StyledFlexColumn>
);
