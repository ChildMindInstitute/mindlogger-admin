import { Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

import { BannerPayload, banners } from 'shared/state/Banners';
import { AppDispatch, useAppDispatch } from 'redux/store';

import { BannerComponents } from './Banners.const';

const handlePureClose = (dispatch: AppDispatch, { key, bannerProps }: BannerPayload) => {
  dispatch(banners.actions.removeBanner({ key }));
  bannerProps?.onClose?.();
};

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
              onClose={() => handlePureClose(dispatch, { key, bannerProps })}
            />
          </Collapse>
        );
      })}
    </TransitionGroup>
  );
};
