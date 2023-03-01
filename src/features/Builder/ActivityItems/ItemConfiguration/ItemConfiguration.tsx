import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { Svg } from 'components';
import {
  StyledHeadlineLarge,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledBodyMedium,
} from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { StyledTop, StyledInputWrapper } from './ItemConfiguration.styles';
import { ItemConfigurationForm } from './ItemConfiguration.types';
import { itemsTypeOptions } from './ItemConfiguration.const';

export const ItemConfiguration = () => {
  const { t } = useTranslation('app');
  const { control } = useForm<ItemConfigurationForm>({
    defaultValues: { itemsInputType: '' },
    mode: 'onChange',
  });

  return (
    <StyledFlexColumn>
      <StyledTop>
        <StyledHeadlineLarge>{t('itemConfiguration')}</StyledHeadlineLarge>
        <StyledFlexTopCenter>
          <StyledClearedButton sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}>
            <Svg id="report-configuration" />
          </StyledClearedButton>
          <StyledClearedButton sx={{ p: theme.spacing(1) }}>
            <Svg id="close" />
          </StyledClearedButton>
        </StyledFlexTopCenter>
      </StyledTop>
      <StyledInputWrapper>
        <GroupedSelectSearchController
          name="itemsInputType"
          options={itemsTypeOptions}
          control={control}
        />
        <StyledBodyMedium
          sx={{ m: theme.spacing(0.5, 0, 0, 1.4) }}
          color={variables.palette.on_surface_variant}
        >
          {t('itemTypeDescription')}
        </StyledBodyMedium>
      </StyledInputWrapper>
    </StyledFlexColumn>
  );
};
