import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { APPLET_PAGES } from 'utils/constants';
import { useAppDispatch } from 'redux/store';
import { popups } from 'redux/modules';

export const useNavigationItems = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const history = useNavigate();
  const dispatch = useAppDispatch();

  return [
    {
      icon: <Svg id="users" />,
      label: t('addUsers'),
      action: () => history(`/${id}/${APPLET_PAGES.addUser}`),
    },
    {
      icon: <Svg id="edit-applet" />,
      label: t('editApplet'),
      action: () => null,
    },
    {
      icon: <Svg id="export" />,
      label: t('exportData'),
      action: () => null,
    },
    {
      icon: <Svg id="duplicate" />,
      label: t('duplicateApplet'),
      action: () =>
        dispatch(
          popups.actions.setPopupVisible({
            appletId: id || '',
            key: 'duplicatePopupsVisible',
            value: true,
          }),
        ),
    },
    {
      icon: <Svg id="trash" />,
      label: t('deleteApplet'),
      action: () =>
        dispatch(
          popups.actions.setPopupVisible({
            appletId: id || '',
            key: 'deletePopupVisible',
            value: true,
          }),
        ),
    },
    {
      icon: <Svg id="transfer-ownership" />,
      label: t('transferOwnership'),
      action: () =>
        dispatch(
          popups.actions.setPopupVisible({
            appletId: id || '',
            key: 'transferOwnershipPopupVisible',
            value: true,
          }),
        ),
    },
    {
      icon: <Svg id="retain-data" />,
      label: t('retainData'),
      action: () => null,
    },
  ];
};
