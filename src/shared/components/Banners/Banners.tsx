import { Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

import { banners } from 'shared/state/Banners';
import { useAppDispatch } from 'redux/store';

import { BannerComponents } from './Banners.const';

export const Banners = () => {
  const dispatch = useAppDispatch();
  const data = banners.useData();

  return (
    <TransitionGroup>
      {data.banners.map(({ key, bannerProps }) => {
        const BannerComponent = BannerComponents[key];

        return (
          <Collapse key={key}>
            <BannerComponent
              {...bannerProps}
              onClose={() => {
                dispatch(banners.actions.removeBanner({ key }));
                bannerProps?.onClose?.();
              }}
            />
          </Collapse>
        );
      })}
    </TransitionGroup>
  );
};
