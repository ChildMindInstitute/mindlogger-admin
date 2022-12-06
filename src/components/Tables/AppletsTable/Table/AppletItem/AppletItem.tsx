import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';

import { useTimeAgo } from 'hooks';
import { FolderApplet } from 'redux/modules';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';
import { Actions } from 'components/Actions';

import { AppletImage } from '../AppletImage';
import { StyledAppletName } from './AppletItem.styles';
import { actions } from './AppletItem.const';

export const AppletItem = ({ item }: { item: FolderApplet }) => {
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();

  const handleAppletClick = (id: string | undefined) => {
    if (id) navigate(`/${id}`);
  };

  return (
    <TableRow>
      <TableCell width="30%" onClick={() => handleAppletClick(item.id)}>
        <StyledAppletName applet={item}>
          <AppletImage image={item.image} appletName={item.name} />
          <StyledBodyMedium color={variables.palette.on_surface} fontWeight={'medium'}>
            {item.name}
          </StyledBodyMedium>
        </StyledAppletName>
      </TableCell>
      <TableCell width="20%" onClick={() => handleAppletClick(item.id)}>
        {item.updated ? timeAgo.format(new Date(item.updated)) : ''}
      </TableCell>
      <TableCell>
        <Actions items={actions} context={item} />
      </TableCell>
    </TableRow>
  );
};
