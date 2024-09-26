import { Collapse } from '@mui/material';
import { FunctionComponent, useCallback, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

import { BannerProps } from 'shared/components/Banners/Banner';

export const useModalBanners = (components: Record<string, FunctionComponent<BannerProps>>) => {
  const [banners, setBanners] = useState<
    { key: keyof typeof components; bannerProps: BannerProps }[]
  >([]);

  const addBanner = useCallback((key: keyof typeof components, bannerProps: BannerProps = {}) => {
    setBanners((prevBanners) => [...prevBanners, { key, bannerProps }]);
  }, []);

  const removeBanner = useCallback((key: keyof typeof components) => {
    setBanners((prevBanners) => prevBanners.filter((banner) => banner.key !== key));
  }, []);

  const removeAllBanners = useCallback(() => {
    setBanners([]);
  }, []);

  const bannersComponent = (
    <TransitionGroup>
      {banners.map(({ key, bannerProps }) => {
        const BannerComponent = components[key];

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
