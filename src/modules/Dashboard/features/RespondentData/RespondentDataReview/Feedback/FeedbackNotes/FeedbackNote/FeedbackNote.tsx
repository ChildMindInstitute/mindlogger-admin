import { useState } from 'react';
import { Box } from '@mui/material';

import { Svg } from 'shared/components';
import { useTimeAgo } from 'shared/hooks';
import { StyledBodyLarge, StyledBodyMedium, StyledFlexTopStart, variables } from 'shared/styles';
import { FeedbackNote as FeedbackNoteType } from '../FeedbackNotes.types';

import {
  StyledActions,
  StyledAuthorLabel,
  StyledButton,
  StyledNote,
  StyledNoteHeader,
} from './FeedbackNote.styles';

export const FeedbackNote = ({ note }: { note: FeedbackNoteType }) => {
  const timeAgo = useTimeAgo();
  const [isVisibleActions, setIsVisibleActions] = useState(false);

  return (
    <StyledNote
      onMouseEnter={() => setIsVisibleActions(true)}
      onMouseLeave={() => setIsVisibleActions(false)}
    >
      <StyledNoteHeader>
        <StyledFlexTopStart>
          <StyledAuthorLabel color={variables.palette.outline}>{note.author}</StyledAuthorLabel>
          <StyledBodyMedium color={variables.palette.outline}>
            {timeAgo.format(note.date)}
          </StyledBodyMedium>
        </StyledFlexTopStart>
        {isVisibleActions && (
          <StyledActions>
            <StyledButton>
              <Svg width="15" height="15" id="edit" />
            </StyledButton>
            <StyledButton>
              <Svg width="15" height="15" id="trash" />
            </StyledButton>
          </StyledActions>
        )}
      </StyledNoteHeader>
      <Box>
        <StyledBodyLarge>{note.content}</StyledBodyLarge>
      </Box>
    </StyledNote>
  );
};
