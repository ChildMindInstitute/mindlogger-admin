import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import debounce from 'lodash.debounce';

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
import { INPUT_DEBOUNCE_TIME } from 'shared/consts';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { StyledContent, StyledHeader, StyledItemConfiguration } from './ItemConfiguration.styles';
import { ItemConfigurationForm, ItemConfigurationProps } from './ItemConfiguration.types';
import { itemsTypeOptions } from './ItemConfiguration.const';
import { getInputTypeTooltip } from './ItemConfiguration.utils';
import { itemConfigurationFormSchema } from './ItemConfiguration.schema';
import { OptionalItemsAndSettings, OptionalItemsRef } from './OptionalItemsAndSettings';

export const ItemConfiguration = ({ item, onItemChange }: ItemConfigurationProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const { t } = useTranslation('app');
  const optionalItemsRef = useRef<OptionalItemsRef | null>(null);

  const methods = useForm<ItemConfigurationForm>({
    resolver: yupResolver(itemConfigurationFormSchema()),
    defaultValues: {
      itemsInputType: '',
      name: '',
      body: '',
      settings: [],
    },
    mode: 'onChange',
  });

  const { control, watch, setValue, getValues, register, unregister, clearErrors, reset } = methods;

  const selectedInputType = watch('itemsInputType');
  const settings = watch('settings');
  const palette = watch('paletteName');

  useEffect(() => {
    reset(
      {
        ...item,
      },
      {
        keepErrors: true,
      },
    );
  }, [item]);

  const handleFormChangeDelayed = debounce(() => onItemChange(getValues()), INPUT_DEBOUNCE_TIME);

  return (
    <FormProvider {...methods}>
      <StyledItemConfiguration ref={containerRef}>
        <form noValidate onChange={handleFormChangeDelayed}>
          <StyledHeader isSticky={isHeaderSticky}>
            <StyledHeadlineLarge>{t('itemConfiguration')}</StyledHeadlineLarge>
            <StyledFlexTopCenter>
              {selectedInputType && (
                <StyledClearedButton
                  sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
                  onClick={() => optionalItemsRef.current?.setSettingsDrawerVisible(true)}
                >
                  <Svg id="report-configuration" />
                </StyledClearedButton>
              )}
              <StyledClearedButton sx={{ p: theme.spacing(1) }}>
                <Svg id="close" />
              </StyledClearedButton>
            </StyledFlexTopCenter>
          </StyledHeader>
          <StyledContent>
            <Grid container direction="row" columns={2} spacing={2.4}>
              <Grid item xs={1}>
                <GroupedSelectSearchController
                  name="itemsInputType"
                  options={itemsTypeOptions}
                  control={control}
                />
                <StyledBodyMedium
                  sx={{ m: theme.spacing(0.2, 1.6, 4.8, 1.6) }}
                  color={variables.palette.on_surface_variant}
                >
                  {selectedInputType && getInputTypeTooltip()[selectedInputType]}
                </StyledBodyMedium>
              </Grid>
              <Grid item xs={1}>
                <InputController
                  fullWidth
                  name="name"
                  control={control}
                  label={t('itemName')}
                  type="text"
                  sx={{ mb: theme.spacing(4) }}
                />
              </Grid>
            </Grid>
            <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>
              {t('displayedContent')}
            </StyledTitleLarge>
            <EditorController
              name="body"
              control={control}
              requiredStateMessage={t('displayedContentRequired')}
              hasRequiredState
            />
            <OptionalItemsAndSettings
              ref={optionalItemsRef}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
              register={register}
              unregister={unregister}
              clearErrors={clearErrors}
              control={control}
              selectedInputType={selectedInputType}
              settings={settings}
              palette={palette}
            />
          </StyledContent>
        </form>
      </StyledItemConfiguration>
    </FormProvider>
  );
};
