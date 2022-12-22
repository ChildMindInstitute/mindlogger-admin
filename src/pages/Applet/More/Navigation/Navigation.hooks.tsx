import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { appletPages } from 'utils/constants';

export const useNavigationItems = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const history = useNavigate();

  return [
    {
      icon: <Svg id="users" />,
      label: t('addUsers'),
      action: () => history(`/${id}/${appletPages.addUser}`),
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
      action: () => null,
    },
    {
      icon: <Svg id="trash" />,
      label: t('deleteApplet'),
      action: () => null,
    },
    {
      icon: <Svg id="transfer-ownership" />,
      label: t('transferOwnership'),
      action: () => null,
    },
    {
      icon: <Svg id="retain-data" />,
      label: t('retainData'),
      action: () => null,
    },
  ];
};
