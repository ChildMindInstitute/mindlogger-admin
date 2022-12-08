import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'components/Svg';
import { AddUser } from 'components/AddUser';
import { useAppDispatch } from 'redux/store';
import { breadcrumbs } from 'redux/modules';
import { useBaseBreadcrumbs } from 'hooks';
import { appletPages } from 'utils/constants';
import { Box } from '@mui/system';

export const More = () => {
  const { id } = useParams();
  const history = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const baseBreadcrumbs = useBaseBreadcrumbs();
  const [activeAddUser, setActiveAddUser] = useState(false);

  const handleAddUserClick = () => {
    setActiveAddUser(true);
    history(`/${id}/${appletPages.addUser}`);
  };

  useEffect(() => {
    if (id && baseBreadcrumbs && baseBreadcrumbs.length > 0) {
      dispatch(
        breadcrumbs.actions.setBreadcrumbs([
          ...baseBreadcrumbs,
          {
            icon: <Svg id="dots-filled" width="15" height="15" />,
            label: t('more'),
          },
        ]),
      );
    }
  }, [baseBreadcrumbs, id, dispatch, t, location]);

  useEffect(() => {
    const { pathname } = location;
    setActiveAddUser(pathname.includes(appletPages.addUser));
  }, [location]);

  return !activeAddUser ? (
    <Box>
      <Button variant="contained" onClick={handleAddUserClick}>
        Add Users
      </Button>
    </Box>
  ) : (
    <AddUser />
  );
};
