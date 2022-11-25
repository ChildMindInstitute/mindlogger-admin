import { TableCell, TableRow } from '@mui/material';

import { Row } from 'components/AppletsTable/Table/Table.types';
import { AppletImage } from 'components/AppletsTable/Table/AppletImage';
import { useTimeAgo } from 'hooks';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';

import { StyledAppletName } from './AppletItem.styles';

export const AppletItem = ({ item }: { item: Row }) => {
  const timeAgo = useTimeAgo();

  return (
    <TableRow>
      <TableCell width="30%">
        <StyledAppletName>
          <AppletImage image={item.image} appletName={item.name} />
          <StyledBodyMedium color={variables.palette.on_surface} fontWeight={'medium'}>
            {item.name}
          </StyledBodyMedium>
        </StyledAppletName>
      </TableCell>
      <TableCell width="15%">
        {item.updated ? timeAgo.format(new Date(item.updated)) : ''}
      </TableCell>
      <TableCell align="right">...</TableCell>
    </TableRow>
  );
};
