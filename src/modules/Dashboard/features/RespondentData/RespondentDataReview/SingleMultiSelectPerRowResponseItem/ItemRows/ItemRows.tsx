import { Checkbox, Radio } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledFlexTopStart } from 'shared/styles';

import { StyledItemContainer, StyledSelectionRowItem } from './ItemRows.styles';
import { ItemRowsProps } from './ItemRows.types';
import { StyledSelectionBox } from '../SingleMultiSelectPerRowResponseItem.styles';

export const ItemRows = ({
  responseValues: { rows, options },
  answers,
  isMultiple = false,
  'data-testid': dataTestid,
}: ItemRowsProps) => (
  <>
    {rows?.map(({ rowName }, rowIndex) => (
      <StyledSelectionRowItem key={rowName} data-testid={`${dataTestid}-row-${rowIndex}`}>
        <StyledSelectionBox
          sx={{ alignItems: 'start' }}
          data-testid={`${dataTestid}-row-${rowIndex}`}
        >
          <StyledFlexTopStart sx={{ gap: '1.2rem' }}>{rowName}</StyledFlexTopStart>
        </StyledSelectionBox>
        {options?.map(({ text }, optionIndex) => (
          <StyledSelectionBox
            key={text}
            data-testid={`${dataTestid}-row-${rowIndex}-option-${optionIndex}`}
          >
            <StyledItemContainer>
              {isMultiple ? (
                <Checkbox
                  checked={!!answers?.value[rowIndex]?.includes(text)}
                  value={text}
                  checkedIcon={<Svg id="checkbox-outlined" />}
                  disabled
                />
              ) : (
                <Radio checked={answers?.value[rowIndex] === text} value={text} disabled />
              )}
            </StyledItemContainer>
          </StyledSelectionBox>
        ))}
      </StyledSelectionRowItem>
    ))}
  </>
);
