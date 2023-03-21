// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SyntheticEvent, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { TextField, Autocomplete, Checkbox, Box } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';

import { Chip } from 'shared/components';

import { TagsAutocompleteControllerProps } from './TagsAutocompleteController.types';

export const TagsInputController = <T extends FieldValues>({
  name,
  control,
  options,
  labelAllSelect,
  ...props
}: TagsAutocompleteControllerProps<T>) => {
  const [selectedOptions, setSelectedOptions] = useState<string[] | undefined>([]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => {
        const allSelected = options?.length === selectedOptions?.length;

        const handleToggleOption = (selectedOps: string[]) => setSelectedOptions(selectedOps);
        const handleClearOptions = () => setSelectedOptions([]);

        const handleSelectAll = (isSelected: boolean) => {
          if (isSelected) {
            setSelectedOptions(options);
          } else {
            handleClearOptions();
          }
        };

        const handleToggleSelectAll = () => {
          handleSelectAll && handleSelectAll(!allSelected);
        };

        const handleChange = (
          e: SyntheticEvent<Element, Event>,
          selectedOps: string[],
          reason: string,
        ) => {
          if (reason === 'selectOption' || reason === 'removeOption') {
            if (selectedOps.some((option) => option === labelAllSelect)) {
              handleToggleSelectAll();

              return onChange(options?.filter((el) => el !== labelAllSelect));
            } else {
              handleToggleOption && handleToggleOption(selectedOps);

              return onChange(selectedOps);
            }
          } else if (reason === 'clear') {
            handleClearOptions && handleClearOptions();
          }
        };

        const filter = createFilterOptions();

        return (
          <Autocomplete
            multiple
            fullWidth
            options={options || []}
            onChange={handleChange}
            value={selectedOptions}
            filterOptions={(options, p) => [labelAllSelect, ...filter(options || [], p)]}
            renderInput={(params) => <TextField {...params} {...props} placeholder="" />}
            renderOption={(props, option, { selected }) => (
              <Box {...props}>
                <Checkbox
                  checked={selected}
                  {...(option === labelAllSelect ? { checked: allSelected } : {})}
                />
                {option}
              </Box>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  color="secondary"
                  key={index}
                  title={option}
                  onRemove={() => {
                    getTagProps(index).onDelete();
                  }}
                />
              ))
            }
          />
        );
      }}
    />
  );
};
