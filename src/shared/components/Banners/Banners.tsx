import { Collapse } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

import { BannerPayload, banners } from 'shared/state/Banners';
import { AppDispatch, useAppDispatch } from 'redux/store';

import { BannerComponents } from './Banners.const';

const handlePureClose = (
  dispatch: AppDispatch,
  { key, bannerProps }: BannerPayload,
  reason?: 'timeout' | 'manual',
) => {
  dispatch(banners.actions.removeBanner({ key }));
  bannerProps?.onClose?.(reason);
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
              onClose={(reason) => handlePureClose(dispatch, { key, bannerProps }, reason)}
            />
          </Collapse>
        );
      })}
    </TransitionGroup>
  );
};
