import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';

import { useCustomFormContext } from 'modules/Builder/hooks/useCustomFormContext';

export const useCheckAndTriggerOnNameUniqueness = <T = unknown>({
  currentPath,
  entitiesFieldPath,
  checkIfShouldIncludeEntity = () => true,
}: {
  currentPath: string;
  entitiesFieldPath: string;
  checkIfShouldIncludeEntity?: (data: T) => boolean;
}) => {
  const { trigger, getFieldState } = useCustomFormContext();
  const [nameChanged, entities]: [string, T[]] = useWatch({
    name: [`${currentPath}.name`, entitiesFieldPath],
  });

  useEffect(() => {
    if (!entities?.length) return;

    const fieldsToTrigger = entities.reduce((acc: string[], entity, index) => {
      const nameField = `${entitiesFieldPath}.${index}.name`;
      if (!checkIfShouldIncludeEntity(entity) || !getFieldState(nameField).error) return acc;

      return acc.concat(nameField);
    }, []);

    fieldsToTrigger.forEach((field) => trigger(field));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameChanged, entities?.length]);
};
