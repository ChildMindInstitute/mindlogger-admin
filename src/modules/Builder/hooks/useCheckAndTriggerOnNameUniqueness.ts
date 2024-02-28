import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';

import { useCustomFormContext } from 'modules/Builder/hooks';

export const useCheckAndTriggerOnNameUniqueness = <T = unknown>({
  currentPath,
  entitiesFieldPath,
  checkIfShouldIncludeEntity = () => true,
}: {
  currentPath: string;
  entitiesFieldPath: string;
  checkIfShouldIncludeEntity?: (data: T) => boolean;
}) => {
  const { getValues, trigger, getFieldState } = useCustomFormContext();
  const [nameChanged, entities] = useWatch({
    name: [`${currentPath}.name`, entitiesFieldPath],
  });

  useEffect(() => {
    const entities = (getValues(entitiesFieldPath) as T[]) ?? [];
    const fieldsToTrigger = entities.reduce((acc: string[], entity, index) => {
      const nameField = `${entitiesFieldPath}.${index}.name`;
      if (!checkIfShouldIncludeEntity(entity) || !getFieldState(nameField).error) return acc;

      return acc.concat(nameField);
    }, []);

    fieldsToTrigger.forEach((field) => trigger(field));
  }, [
    checkIfShouldIncludeEntity,
    entitiesFieldPath,
    nameChanged,
    entities?.length,
    getFieldState,
    getValues,
    trigger,
  ]);
};
