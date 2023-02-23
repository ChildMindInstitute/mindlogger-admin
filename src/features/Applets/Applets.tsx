import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useAppDispatch } from 'redux/store';
import { applets, auth, FolderApplet, folders } from 'redux/modules';
import { ButtonWithMenu, DEFAULT_ROWS_PER_PAGE, Search, Svg } from 'components';
import { Order } from 'types/table';
import { getErrorMessage } from 'utils/errors';
import { getAppletsApiTest } from 'api/Dashboard';

import { Table } from './Table';
import { getHeadCells, getMenuItems } from './Applets.const';
import { StyledButtons, AppletsTableHeader } from './Applets.styles';
import { generateNewFolderName } from './Applets.utils';

export const Applets = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  // TODO: implement folders logic when connecting to the corresponding API
  const foldersApplets: FolderApplet[] = folders.useFlattenFoldersApplets();
  const authData = auth.useData();
  const navigate = useNavigate();
  const userId = authData?.user.id;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState('updated');
  const [order, setOrder] = useState<Order>('desc');
  const [flattenItems, setFlattenItems] = useState<FolderApplet[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setFlattenItems(foldersApplets);
  }, [foldersApplets]);

  useEffect(() => {
    (async () => {
      if (userId) {
        const { getApplets } = applets.thunk;
        const result = await dispatch(
          getApplets({
            params: {
              // eslint-disable-next-line camelcase
              owner_id: userId,
              limit: DEFAULT_ROWS_PER_PAGE,
              search,
              page,
              ordering,
              order,
            },
          }),
        );

        if (getApplets.fulfilled.match(result)) {
          setFlattenItems(result.payload.data.result);
        }
      }
    })();
  }, [dispatch, userId, search, page, ordering, order]);

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

  // const filterRows = (row: FolderApplet) => {
  //   // if (!row.isVisible) return;
  //   if (!search) {
  //     return row;
  //   }
  //   if (!row?.isFolder && row?.displayName?.toLowerCase().includes(search?.toLowerCase())) {
  //     return row;
  //   } else {
  //     let isFolderContainsSearchApplet = false;
  //
  //     row?.items?.forEach((itemInFolder) => {
  //       if (itemInFolder?.displayName?.toLowerCase().includes(search.toLowerCase())) {
  //         isFolderContainsSearchApplet = true;
  //       }
  //     });
  //
  //     if (isFolderContainsSearchApplet) {
  //       return row;
  //     }
  //   }
  // };

  const headerContent = (
    <Box onClick={() => addFolder()}>
      <Svg id="add-folder" />
    </Box>
  );

  const emptyComponent = flattenItems.length ? t('noMatchWasFound', { search }) : t('noApplets');

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
        // rows={flattenItems?.filter(filterRows)}
        rows={flattenItems}
        order={order}
        setOrder={setOrder}
        orderBy={ordering}
        setOrderBy={setOrdering}
        headerContent={headerContent}
        emptyComponent={emptyComponent}
        page={page}
        setPage={setPage}
      />
    </>
  );
};
