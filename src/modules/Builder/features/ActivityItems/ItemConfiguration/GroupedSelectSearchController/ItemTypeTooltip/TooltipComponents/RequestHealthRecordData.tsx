import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium } from 'shared/styles/styledComponents';

import { StyledPresentation } from './TooltipComponents.styles';
import { tooltipPresentationDataTestid } from '../ItemTypeTooltip.const';

export const RequestHealthRecordData = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation data-testid={tooltipPresentationDataTestid}>
        <Svg id="request-health-record-data" width="21rem" height="12rem" />
      </StyledPresentation>
      <StyledBodyMedium>{t('requestHealthRecordDataHint')}</StyledBodyMedium>
    </>
  );
};
