import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow, TextField } from '@mui/material';

import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { Svg } from 'components/Svg';
import { variables } from 'styles/variables';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { FolderItemProps } from './FolderItem.types';
import { StyledFolderIcon, StyledCountApplets, StyledFolderName } from './FolderItem.styles';

export const FolderItem = ({ item, onRowClick }: FolderItemProps) => {
  const { t } = useTranslation('app');

  const [row, setRow] = useState(item);
  useEffect(() => setRow(item), [item]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRow({ ...item, name: event.target.value });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setRow({ ...row, isRenaming: false }); // TODO request
    }
  };

  return (
    <TableRow onClick={() => onRowClick(row)}>
      <TableCell width="30%">
        <StyledFlexTopCenter>
          {row?.isRenaming ? (
            <TextField value={row.name} onChange={handleChange} onKeyDown={handleKeyDown} />
          ) : (
            <>
              <StyledFolderIcon>
                <Svg id="folder" />
              </StyledFolderIcon>
              <StyledFolderName>
                <StyledBodyMedium color={variables.palette.on_surface} fontWeight={'medium'}>
                  {row.name}
                </StyledBodyMedium>
                <StyledCountApplets>
                  ({item?.items?.length} {t('applets')})
                </StyledCountApplets>
              </StyledFolderName>
            </>
          )}
        </StyledFlexTopCenter>
      </TableCell>
      <TableCell width="15%"></TableCell>
      <TableCell align="right"></TableCell>
    </TableRow>
  );
};
