import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';

import { Svg } from 'components/Svg';
import { useTimeAgo } from 'hooks';
import { FoldersApplets } from 'redux/modules';
import { StyledBodyMedium } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';

import { AppletImage } from '../AppletImage';
import {
  StyledActionButton,
  StyledActions,
  StyledAppletName,
  StyledRightCell,
} from './AppletItem.styles';
import { actions } from './AppletItem.const';

export const AppletItem = ({ item }: { item: FoldersApplets }) => {
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();

  const handleAppletClick = (id: string | undefined) => {
    if (id) navigate(`/${id}`);
  };

  return (
    <TableRow>
      <TableCell width="30%" onClick={() => handleAppletClick(item.id)}>
        <StyledAppletName>
          <AppletImage image={item.image} appletName={item.name} />
          <StyledBodyMedium color={variables.palette.on_surface} fontWeight={'medium'}>
            {item.name}
          </StyledBodyMedium>
        </StyledAppletName>
      </TableCell>
      <TableCell width="15%" onClick={() => handleAppletClick(item.id)}>
        {item.updated ? timeAgo.format(new Date(item.updated)) : ''}
      </TableCell>
      <StyledRightCell align="right">
        <Svg id="dots" width={18} height={4} />
        <StyledActions className="cell-actions">
          {actions.map(({ icon, action }, i) => (
            <StyledActionButton key={i} onClick={() => action(item)}>
              {icon}
            </StyledActionButton>
          ))}
        </StyledActions>
      </StyledRightCell>
    </TableRow>
  );
};
