import { Controller, FieldValues } from 'react-hook-form';

import { ItemSettingsGroup } from './ItemSettingsGroup';
import { ItemSettingsControllerProps } from './ItemSettingsController.types';
import { itemSettingsOptionsByInputType } from './ItemSettingsController.const';

export const ItemSettingsController = <T extends FieldValues>({
  name,
  inputType,
  control,
}: ItemSettingsControllerProps<T>) =>
  inputType ? (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <>
          {itemSettingsOptionsByInputType[inputType]?.map(
            ({ groupName, groupOptions, collapsedByDefault }) => (
              <ItemSettingsGroup
                key={`item-settings-group-${groupName}`}
                value={value}
                onChange={onChange}
                groupName={groupName}
                inputType={inputType}
                groupOptions={groupOptions}
                collapsedByDefault={collapsedByDefault}
              />
            ),
          )}
        </>
      )}
    />
  ) : null;
