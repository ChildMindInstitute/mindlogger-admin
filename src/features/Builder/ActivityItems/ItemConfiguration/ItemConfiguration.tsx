import { useTranslation } from 'react-i18next';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import uniqueId from 'lodash.uniqueid';

import { Svg } from 'components';
import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
} from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { StyledInputWrapper, StyledOptionsWrapper, StyledTop } from './ItemConfiguration.styles';
import { ItemConfigurationForm, ItemInputTypes } from './ItemConfiguration.types';
import { itemsTypeOptions } from './ItemConfiguration.const';
import { SelectionOption } from './SelectionOption';

export const ItemConfiguration = () => {
  const { t } = useTranslation('app');
  const { control, watch } = useForm<ItemConfigurationForm>({
    defaultValues: { itemsInputType: '' },
    mode: 'onChange',
  });

  const {
    fields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: 'options',
  });

  const selectedInputType = watch('itemsInputType');
  const options = watch('options');

  const hasOptions =
    selectedInputType === ItemInputTypes.SingleSelection ||
    selectedInputType === ItemInputTypes.MultipleSelection;

  const handleAddOption = () =>
    appendOption({
      text: '',
      isVisible: true,
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
      {hasOptions && (
        <StyledOptionsWrapper>
          {options?.length
            ? options.map((option, index) => (
                <SelectionOption
                  key={uniqueId()}
                  removeOption={removeOption}
                  index={index}
                  {...option}
                />
              ))
            : null}
          <Button
            onClick={handleAddOption}
            variant="outlined"
            startIcon={<Svg id="add" width="20" height="20" />}
          >
            {t('addOption')}
          </Button>
        </StyledOptionsWrapper>
      )}
    </StyledFlexColumn>
  );
};
