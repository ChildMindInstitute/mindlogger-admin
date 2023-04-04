import { Trans, useTranslation } from 'react-i18next';

import { applet } from 'shared/state';
import { StyledBodyLarge, variables } from 'shared/styles';

import { SavaAndPublishStep } from '../SaveAndPublishProcessPopup.types';
import { DescriptionProps } from './Description.types';

export const Description = ({ step }: DescriptionProps) => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};

  switch (step) {
    case SavaAndPublishStep.AtLeast1Activity:
      return <>{t('appletIsRequiredOneActivity')}</>;
    case SavaAndPublishStep.AtLeast1Item:
      return <>{t('appletIsRequiredOneItem')}</>;
    case SavaAndPublishStep.BeingCreated:
      return <>{t('appletIsBeingCreated')}</>;
    case SavaAndPublishStep.Success:
      return (
        <Trans i18nKey="appletSavedAndPublished">
          <StyledBodyLarge>
            Applet
            <strong>
              <>{{ name: appletData?.displayName }}</>
            </strong>
            has been successfully saved and published.
          </StyledBodyLarge>
        </Trans>
      );
    case SavaAndPublishStep.Failed:
      return (
        <Trans i18nKey="appletNotSavedAndPublished">
          <StyledBodyLarge sx={{ color: variables.palette.red }}>
            Applet
            <strong>
              <>{{ name: appletData?.displayName }}</>
            </strong>
            has not been saved and published. Please try again.
          </StyledBodyLarge>
        </Trans>
      );
  }
};
