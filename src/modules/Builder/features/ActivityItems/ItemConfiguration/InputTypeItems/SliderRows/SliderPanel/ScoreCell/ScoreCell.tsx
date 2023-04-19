import { useState, ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, ClickAwayListener } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles';

import { StyledInputController } from './ScoreCell.styles';

export const ScoreCell = ({ name }: { name: string }) => {
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
        <StyledFlexTopCenter sx={{ height: '100%' }} onClick={handleClick}>
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
        />
      </Box>
    </ClickAwayListener>
  );
};
