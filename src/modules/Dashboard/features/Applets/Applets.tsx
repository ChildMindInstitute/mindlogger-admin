import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { applets, auth, FolderApplet, folders } from 'redux/modules';
import { ButtonWithMenu, DEFAULT_ROWS_PER_PAGE, Search, Svg } from 'shared/components';
import { Order } from 'shared/types/table';

import { Table } from './Table';
import { getHeadCells, getMenuItems } from './Applets.const';
import { AppletsTableHeader, StyledButtons } from './Applets.styles';
import { generateNewFolderName } from './Applets.utils';
import { OrderBy } from './Applets.types';

export const Applets = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const authData = auth.useData();
  const appletsData = applets.useData();
  const navigate = useNavigate();

  const ownerId = authData?.user.id;
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.UpdatedAt);
  const [order, setOrder] = useState<Order>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // TODO: implement folders logic when connecting to the corresponding API
  const foldersApplets: FolderApplet[] = folders.useFlattenFoldersApplets();

  // useEffect(() => {
  //   setFlattenItems(foldersApplets);
  // }, [foldersApplets]);

  useEffect(() => {
    if (!ownerId) return;

    const ordering = `${order === 'asc' ? '+' : '-'}${orderBy}`;
    const { getApplets } = applets.thunk;
    dispatch(
      getApplets({
        params: {
          ownerId,
          limit: DEFAULT_ROWS_PER_PAGE,
          search,
          page,
          ordering,
        },
      }),
    );
  }, [dispatch, ownerId, search, page, orderBy, order]);

  const addFolder = () => {
    const newFolderName = generateNewFolderName(foldersApplets, t);
    const folder = {
      id: (Math.random() + Math.random()).toString(),
      name: newFolderName,
      isFolder: true,
      description: '',
      isExpanded: false,
      items: [],
      roles: [],
      isNew: true,
      isRenaming: true,
      isVisible: true,
      depth: 0,
      parentId: String(authData?.user?.id) || '',
    };
    dispatch(folders.actions.createNewFolder(folder));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const headerContent = (
    <Box onClick={() => addFolder()}>
      <Svg id="add-folder" />
    </Box>
  );

  const getEmptyComponent = () => {
    if (!appletsData?.result?.length) {
      if (search) {
        return t('noMatchWasFound', { searchValue: search });
      }

      return t('noApplets');
    }
  };

  return (
    <>
      <AppletsTableHeader>
        <StyledButtons>
          <ButtonWithMenu
            variant="outlined"
            label={t('addApplet')}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            menuItems={getMenuItems(() => setAnchorEl(null), navigate)}
            startIcon={<Svg width="18" height="18" id="applet-outlined" />}
          />
        </StyledButtons>
        <Search placeholder={t('searchApplets')} onSearch={handleSearch} />
      </AppletsTableHeader>
      <Table
        columns={getHeadCells()}
        rows={appletsData?.result || []}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        headerContent={headerContent}
        emptyComponent={getEmptyComponent()}
        page={page}
        setPage={setPage}
        count={appletsData?.count || 0}
      />
    </>
  );
};
