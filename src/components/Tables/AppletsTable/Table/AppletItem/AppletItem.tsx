import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';

import { useTimeAgo } from 'hooks';
import { useAppDispatch } from 'redux/store';
import { FolderApplet, folders } from 'redux/modules';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { Actions } from 'components/Actions';
import { appletPages } from 'utils/constants';
import { Pin } from 'components/Pin';

import { AppletImage } from '../AppletImage';
import { StyledAppletName, StyledPinContainer } from './AppletItem.styles';
import { actions } from './AppletItem.const';

export const AppletItem = ({ item }: { item: FolderApplet }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();

  const handleAppletClick = (id: string | undefined) => {
    if (id) navigate(`/${id}/${appletPages.respondents}`);
  };

  return (
    <TableRow>
      <TableCell width="30%" onClick={() => handleAppletClick(item.id)}>
        <StyledAppletName applet={item}>
          {item.parentId && (
            <StyledPinContainer>
              <Pin
                isPinned={!!item?.pinOrder}
                onClick={(e) => {
                  dispatch(folders.thunk.togglePin(item));
                  e.stopPropagation();
                }}
              />
            </StyledPinContainer>
          )}
          <AppletImage image={item.image} appletName={item.name} />
          <StyledBodyMedium fontWeight={'medium'}>{item.name}</StyledBodyMedium>
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
