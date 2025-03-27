import { Link } from '@mui/material';
import { Trans } from 'react-i18next';

import { Svg } from 'shared/components/Svg';

import { Banner } from '../Banner';
import { BannerProps } from '../Banner/Banner.types';
import { EHR_LEARN_MORE_URL } from './EHRBanners.const';

export const EHRBannerAvailable = (props: BannerProps) => (
  <Banner
    duration={null}
    severity="info"
    color="infoAlt"
    iconMapping={{
      info: <Svg id="stethoscope" width={32} height={32} fill="currentColor" />,
    }}
    data-testid="ehr-banner-available"
    {...props}
  >
    <Trans i18nKey="ehr.bannerAvailable">
      <>Now you can collect participants' Health Care Data in studies!</>
      <Link href={EHR_LEARN_MORE_URL} target="_blank">
        Learn more
      </Link>
    </Trans>
  </Banner>
);
