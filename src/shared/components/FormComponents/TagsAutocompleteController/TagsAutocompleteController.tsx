import { Autocomplete, Checkbox, Divider, FormControlLabel, ListItem, Paper } from '@mui/material';
import { MouseEvent, SyntheticEvent, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';

import { Chip, ChipShape } from 'shared/components/Chip';
import { Svg } from 'shared/components/Svg';
import { theme, variables } from 'shared/styles';

import { StyledTagsContainer, StyledTextField } from './TagsAutocompleteController.styles';
import {
  AutocompleteOption,
  TagsAutocompleteControllerProps,
} from './TagsAutocompleteController.types';

export const TagsAutocompleteController = <
  FormType extends FieldValues,
  Value extends AutocompleteOption,
>({
  name,
  control,
  options,
  labelAllSelect,
  noOptionsText,
  disabled,
  limitTagRows,
  limitTags,
  defaultSelectedAll = false,
  onCustomChange,
  renderOption,
  'data-testid': dataTestid,
  textFieldProps,
}: TagsAutocompleteControllerProps<FormType, Value>) => {
  const [selectedAll, setSelectedAll] = useState<boolean>(defaultSelectedAll);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const handleToggleSelectAll = (e: MouseEvent<HTMLLabelElement>) => {
          e.preventDefault(); // prevent blur
          setSelectedAll((prev) => {
            if (prev) {
              onChange([]);
              onCustomChange?.([]);
            } else {
              onChange(options);
              onCustomChange?.(options);
            }

            return !prev;
          });
        };

        const handleChange = (
          _e: SyntheticEvent<Element, Event>,
          value: Value[],
          reason: string,
        ) => {
          if (reason === 'clear' || reason === 'removeOption') setSelectedAll(false);
          if (reason === 'selectOption' && value?.length === options?.length) setSelectedAll(true);
          onChange(value);
          onCustomChange?.(value);
        };

        return (
          <Autocomplete
            id="autocomplete"
            multiple
            limitTags={limitTags}
            options={options}
            fullWidth
            disableCloseOnSelect
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={<ListItem sx={{ pl: theme.spacing(1.3) }}>{noOptionsText}</ListItem>}
            freeSolo={false}
            value={value || []}
            onChange={handleChange}
            disabled={disabled}
            popupIcon={
              <Svg
                id="navigate-down"
                width={24}
                height={24}
                fill={variables.palette[disabled ? 'on_surface_alpha38' : 'on_surface_variant']}
              />
            }
            renderInput={({ InputLabelProps: _InputLabelProps, ...params }) => (
              <StyledTextField
                limitRows={value?.length && limitTagRows}
                {...params}
                {...textFieldProps}
              />
            )}
            renderOption={(props, option, state, ownerState) => (
              <ListItem {...props}>
                <Checkbox checked={state.selected} />
                {renderOption ? renderOption(option, state, ownerState) : option.label}
              </ListItem>
            )}
            renderTags={(value, getTagProps) => {
              const tags = value.map((option, index) => {
                const { onDelete, ...rest } = getTagProps({ index });

                return (
                  <Chip
                    title={option.label}
                    canRemove
                    onRemove={() => onDelete(null)}
                    shape={ChipShape.Rectangular}
                    sx={{ py: 0.5, height: 'auto' }}
                    {...rest}
                  />
                );
              });

              return limitTagRows ? (
                <StyledTagsContainer limitRows={limitTagRows}>{tags}</StyledTagsContainer>
              ) : (
                tags
              );
            }}
            PaperComponent={(paperProps) => {
              const { children, ...restPaperProps } = paperProps;

              return (
                <Paper {...restPaperProps}>
                  <>
                    {options?.length ? (
                      <ListItem
                        onMouseDown={(event) => event.preventDefault()} // prevent blur
                        sx={{ pl: theme.spacing(2.8) }}
                      >
                        <FormControlLabel
                          onClick={handleToggleSelectAll}
                          label={labelAllSelect}
                          sx={{
                            width: '100%',
                          }}
                          control={<Checkbox id="select-all-checkbox" checked={selectedAll} />}
                        />
                      </ListItem>
                    ) : null}
                    <Divider />
                    {children}
                  </>
                </Paper>
              );
            }}
            slotProps={{ popper: { placement: 'bottom' } }}
            data-testid={dataTestid}
          />
        );
      }}
    />
  );
};
