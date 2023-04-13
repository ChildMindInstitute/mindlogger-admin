import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';

import { Svg } from 'shared/components';
import { EditorController, InputController } from 'shared/components/FormComponents';
import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';
import { ItemResponseType } from 'shared/consts';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { StyledContent, StyledHeader, StyledItemConfiguration } from './ItemConfiguration.styles';
import { ItemConfigurationProps } from './ItemConfiguration.types';
import { itemsTypeOptions } from './ItemConfiguration.const';
import { getInputTypeTooltip } from './ItemConfiguration.utils';
import { OptionalItemsAndSettings, OptionalItemsRef } from './OptionalItemsAndSettings';

//@TODO: add validation
export const ItemConfiguration = ({ name, onClose }: ItemConfigurationProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const { t } = useTranslation('app');
  const optionalItemsRef = useRef<OptionalItemsRef | null>(null);

  const methods = useFormContext();

  const { control, watch } = methods;

  const responseType = watch(`${name}.responseType`) as ItemResponseType;

  return (
    <StyledItemConfiguration ref={containerRef}>
      <StyledHeader isSticky={isHeaderSticky}>
        <StyledHeadlineLarge>{t('itemConfiguration')}</StyledHeadlineLarge>
        <StyledFlexTopCenter>
          {responseType && (
            <StyledClearedButton
              sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
              onClick={() => optionalItemsRef.current?.setSettingsDrawerVisible(true)}
            >
              <Svg id="report-configuration" />
            </StyledClearedButton>
          )}
          <StyledClearedButton sx={{ p: theme.spacing(1) }} onClick={onClose}>
            <Svg id="close" />
          </StyledClearedButton>
        </StyledFlexTopCenter>
      </StyledHeader>
      <StyledContent>
        <Grid container direction="row" columns={2} spacing={2.4}>
          <Grid item xs={1}>
            <GroupedSelectSearchController
              name={`${name}.responseType`}
              options={itemsTypeOptions}
              control={control}
            />
            <StyledBodyMedium
              sx={{ m: theme.spacing(0.2, 1.6, 4.8, 1.6) }}
              color={variables.palette.on_surface_variant}
            >
              {responseType && getInputTypeTooltip()[responseType]}
            </StyledBodyMedium>
          </Grid>
          <Grid item xs={1}>
            <InputController
              fullWidth
              name={`${name}.name`}
              control={control}
              label={t('itemName')}
              type="text"
              sx={{ mb: theme.spacing(4) }}
            />
          </Grid>
        </Grid>
        <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>{t('displayedContent')}</StyledTitleLarge>
        <EditorController
          name={`${name}.question`}
          control={control}
          requiredStateMessage={t('displayedContentRequired')}
          hasRequiredState
        />
        <OptionalItemsAndSettings name={name} ref={optionalItemsRef} />
      </StyledContent>
    </StyledItemConfiguration>
  );
};
