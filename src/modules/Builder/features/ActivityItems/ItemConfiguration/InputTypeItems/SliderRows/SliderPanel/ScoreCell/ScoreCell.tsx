import { useState, ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, ClickAwayListener } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles';

import { StyledInputController } from './ScoreCell.styles';
import { ScoreCellProps } from './ScoreCell.types';

export const ScoreCell = ({ name, 'data-testid': dataTestid }: ScoreCellProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { control, getValues, getFieldState, setValue } = useFormContext();

  const handleClick = () => setIsEditing(true);

  const handleClickAway = () => {
    const { error } = getFieldState(name);

    if (!error) setIsEditing(false);
  };

  if (!isEditing)
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <StyledFlexTopCenter
          sx={{ height: '100%' }}
          onClick={handleClick}
          data-testid={`${dataTestid}-score-inactive`}
        >
          {getValues(name)}
        </StyledFlexTopCenter>
      </ClickAwayListener>
    );

  const handleScoreChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') return setValue(name, 0);

    setValue(name, +event.target.value);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <StyledInputController
          control={control}
          name={name}
          type="number"
          minNumberValue={Number.MIN_SAFE_INTEGER}
          autoFocus
          isEmptyStringAllowed
          isErrorVisible={false}
          onChange={handleScoreChange}
          data-testid={`${dataTestid}-score`}
        />
      </Box>
    </ClickAwayListener>
  );
};
