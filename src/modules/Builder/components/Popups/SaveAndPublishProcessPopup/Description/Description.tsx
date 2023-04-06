import { Trans, useTranslation } from 'react-i18next';

import { StyledBodyLarge, variables } from 'shared/styles';
import { useAppletData } from 'modules/Builder/features/SaveAndPublish/SaveAndPublish.hooks';

import { SaveAndPublishSteps } from '../SaveAndPublishProcessPopup.types';
import { DescriptionProps } from './Description.types';

export const Description = ({ step }: DescriptionProps) => {
  const { t } = useTranslation('app');
  const getAppletData = useAppletData();
  const name = getAppletData().displayName;

  switch (step) {
    case SaveAndPublishSteps.AtLeastOneActivity:
      return <StyledBodyLarge>{t('appletIsRequiredOneActivity')}</StyledBodyLarge>;
    case SaveAndPublishSteps.AtLeastOneItem:
      return <StyledBodyLarge>{t('appletIsRequiredOneItem')}</StyledBodyLarge>;
    case SaveAndPublishSteps.BeingCreated:
      return <StyledBodyLarge>{t('appletIsBeingCreated')}</StyledBodyLarge>;
    case SaveAndPublishSteps.Success:
      return (
        <Trans i18nKey="appletSavedAndPublished">
          <StyledBodyLarge>
            Applet
            <strong>
              <>{{ name }}</>
            </strong>
            has been successfully saved and published.
          </StyledBodyLarge>
        </Trans>
      );
    case SaveAndPublishSteps.Failed:
      return (
        <Trans i18nKey="appletNotSavedAndPublished">
          <StyledBodyLarge sx={{ color: variables.palette.red }}>
            Applet
            <strong>
              <>{{ name }}</>
            </strong>
            has not been saved and published. Please try again.
          </StyledBodyLarge>
        </Trans>
      );
  }
};
