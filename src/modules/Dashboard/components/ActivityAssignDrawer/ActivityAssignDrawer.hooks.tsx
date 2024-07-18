import { Collapse } from '@mui/material';
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

import { BannerProps } from 'shared/components/Banners/Banner';

import { ActivityAssignBannerComponents } from './ActivityAssignDrawer.const';

export const useActivityAssignBanners = () => {
  const [banners, setBanners] = useState<
    { key: keyof typeof ActivityAssignBannerComponents; bannerProps: BannerProps }[]
  >([]);

  const addBanner = (
    key: keyof typeof ActivityAssignBannerComponents,
    bannerProps: BannerProps = {},
  ) => {
    setBanners((prevBanners) => [...prevBanners, { key, bannerProps }]);
  };

  const removeBanner = (key: keyof typeof ActivityAssignBannerComponents) => {
    setBanners((prevBanners) => prevBanners.filter((banner) => banner.key !== key));
  };

  const removeAllBanners = () => {
    setBanners([]);
  };

  const bannersComponent = (
    <TransitionGroup>
      {banners.map(({ key, bannerProps }) => {
        const BannerComponent = ActivityAssignBannerComponents[key];

        return (
          <Collapse key={key}>
            <BannerComponent
              {...bannerProps}
              onClose={() => {
                removeBanner(key);
                bannerProps.onClose?.();
              }}
            />
          </Collapse>
        );
      })}
    </TransitionGroup>
  );

  return { bannersComponent, addBanner, removeBanner, removeAllBanners };
};
