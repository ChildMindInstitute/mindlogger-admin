import { Trans, useTranslation } from 'react-i18next';

import {
  StyledBodyMedium,
  StyledTitleBoldSmall,
  StyledTitleSmall,
} from 'shared/styles/styledComponents';
import { variables } from 'shared/styles';

import { StyledPresentation } from './TooltipComponents.styles';
import { tooltipPresentationDataTestid } from '../ItemTypeTooltip.const';

export const PhrasalTemplate = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation data-testid={tooltipPresentationDataTestid} sx={{ px: 2 }}>
        <StyledTitleSmall>
          <Trans
            i18nKey="phrasalTemplateExample"
            components={{
              em: (
                <StyledTitleBoldSmall
                  as="span"
                  sx={{
                    background: variables.palette.primary_container,
                    borderRadius: variables.borderRadius.xs,
                    boxDecorationBreak: 'clone',
                    display: 'inline',
                    px: 0.4,
                    py: 0.2,
                  }}
                />
              ),
            }}
          />
        </StyledTitleSmall>
      </StyledPresentation>

      <StyledBodyMedium>{t('phrasalTemplateHint')}</StyledBodyMedium>
    </>
  );
};
