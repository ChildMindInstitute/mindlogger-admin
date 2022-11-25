import { useState } from 'react';
import { TableCell, TableRow, TextField } from '@mui/material';

import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { Svg } from 'components/Svg';
import { variables } from 'styles/variables';
import { FoldersApplets } from 'redux/modules';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { StyledFolderIcon } from './FolderItem.styles';

export const FolderItem = ({ item }: { item: FoldersApplets }) => {
  const [row, setRow] = useState(item);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRow({ ...item, name: event.target.value });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setRow({ ...row, isRenaming: false }); // TODO request
    }
  };

  return (
    <TableRow>
      <TableCell width="30%">
        <StyledFlexTopCenter>
          {row?.isRenaming ? (
            <TextField value={row.name} onChange={handleChange} onKeyDown={handleKeyDown} />
          ) : (
            <>
              <StyledFolderIcon>
                <Svg id="folder" />
              </StyledFolderIcon>
              <StyledBodyMedium color={variables.palette.on_surface} fontWeight={'medium'}>
                {row.name}
              </StyledBodyMedium>
            </>
          )}
        </StyledFlexTopCenter>
      </TableCell>
      <TableCell width="15%"></TableCell>
      <TableCell align="right">...</TableCell>
    </TableRow>
  );
};
