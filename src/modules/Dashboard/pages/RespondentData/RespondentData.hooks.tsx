import { useParams } from 'react-router-dom';

import { Svg } from 'shared/components';
import { APPLET_PAGES } from 'shared/consts';
import { page } from 'resources';

export const useRespondentDataTabs = () => {
  const { id, respondentId } = useParams();

  return [
    {
      labelKey: 'summary',
      icon: <Svg id="chart" />,
      activeIcon: <Svg id="chart" />,
      path: `${page.dashboard}/${id}/${APPLET_PAGES.respondents}/${respondentId}/data/summary`,
    },
    {
      labelKey: 'review',
      icon: <Svg id="checkbox-filled" />,
      activeIcon: <Svg id="checkbox-filled" />,
      path: `${page.dashboard}/${id}/${APPLET_PAGES.respondents}/${respondentId}/data/review`,
    },
  ];
};
