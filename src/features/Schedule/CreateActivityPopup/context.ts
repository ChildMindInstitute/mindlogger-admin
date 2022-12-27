import { useFormContext } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { UseFormReturn } from 'react-hook-form/dist/types/form';

export const ConnectForm = ({
  children,
}: {
  children: (methods: UseFormReturn<FieldValues>) => JSX.Element;
}) => {
  const methods = useFormContext();

  return children({ ...methods });
};
