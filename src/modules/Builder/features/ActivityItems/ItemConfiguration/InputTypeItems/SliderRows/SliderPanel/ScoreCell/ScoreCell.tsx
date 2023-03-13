import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ClickAwayListener } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles';

import { StyledInputController } from './ScoreCell.styles';

export const ScoreCell = ({ name }: { name: string }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { control, getValues } = useFormContext();

  const handleClick = () => setIsEditing(true);

  const handleClickAway = () => setIsEditing(false);

  if (!isEditing)
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <StyledFlexTopCenter sx={{ height: '100%' }} onClick={handleClick}>
          {getValues(name)}
        </StyledFlexTopCenter>
      </ClickAwayListener>
    );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <StyledInputController control={control} name={name} type="number" autoFocus />
      </div>
    </ClickAwayListener>
  );
};
