import { Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

import { BannerComponents, banners } from 'shared/state/Banners';
import { useAppDispatch } from 'redux/store';

export const Banners = () => {
  const dispatch = useAppDispatch();
  const data = banners.useData();

  return (
    <TransitionGroup>
      {data.banners.map(({ key }) => {
        const BannerComponent = BannerComponents[key];

        return (
          <Collapse key={key}>
            <BannerComponent onClose={() => dispatch(banners.actions.removeBanner({ key }))} />
          </Collapse>
        );
      })}
    </TransitionGroup>
  );
};
