import { useState } from 'react';

import { Box, ClickAwayListener } from '@mui/material';
import get from 'lodash.get';

import { StyledFlexTopCenter } from 'shared/styles';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { StyledInputController } from './ScoreCell.styles';
import { ScoreCellProps } from './ScoreCell.types';

export const ScoreCell = ({ name, 'data-testid': dataTestid }: ScoreCellProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    getValues,
    formState: { errors },
  } = useCustomFormContext();

  const error = get(errors, name);

  const handleClick = () => setIsEditing(true);
  const handleClickAway = () => setIsEditing(false);

  if (!error && !isEditing)
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <StyledFlexTopCenter sx={{ height: '100%' }} onClick={handleClick} data-testid={`${dataTestid}-score-inactive`}>
          {getValues(name)}
        </StyledFlexTopCenter>
      </ClickAwayListener>
    );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <StyledInputController
          control={control}
          name={name}
          type="number"
          autoFocus
          isErrorVisible={false}
          data-testid={`${dataTestid}-score`}
        />
      </Box>
    </ClickAwayListener>
  );
};
