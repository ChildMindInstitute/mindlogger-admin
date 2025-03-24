import { Link } from '@mui/material';
import { Trans } from 'react-i18next';

import { Banner } from '../Banner';
import { BannerProps } from '../Banner/Banner.types';
import { EHR_CONTACT_URL } from './EHRBanners.const';

export const EHRBannerActive = (props: BannerProps) => (
  <Banner {...props} duration={null} severity="success">
    <Trans i18nKey="ehr.bannerActive">
      <>Your Electronic Health Data Integration is active. If you have any questions or issues, </>
      <Link href={EHR_CONTACT_URL} target="_blank">
        contact us
      </Link>
      <>.</>
    </Trans>
  </Banner>
);
