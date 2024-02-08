import { Controller, FieldValues } from 'react-hook-form';

import { itemSettingsOptionsByInputType } from './ItemSettingsController.const';
import { ItemSettingsControllerProps } from './ItemSettingsController.types';
import { ItemSettingsGroup } from './ItemSettingsGroup';

export const ItemSettingsController = <T extends FieldValues>({
  name,
  itemName,
  inputType,
  control,
}: ItemSettingsControllerProps<T>) =>
  inputType ? (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <>
          {itemSettingsOptionsByInputType[inputType]?.map(({ groupName, groupOptions, collapsedByDefault }) => (
            <ItemSettingsGroup
              name={name}
              itemName={itemName}
              key={`item-settings-group-${groupName}`}
              onChange={onChange}
              groupName={groupName}
              inputType={inputType}
              groupOptions={groupOptions}
              collapsedByDefault={collapsedByDefault}
            />
          ))}
        </>
      )}
    />
  ) : null;
