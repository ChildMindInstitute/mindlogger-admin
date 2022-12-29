import { useFormContext, FieldValues, UseFormReturn } from 'react-hook-form';

export const ConnectForm = ({
  children,
}: {
  children: (methods: UseFormReturn<FieldValues>) => JSX.Element;
}) => {
  const methods = useFormContext();

  return children({ ...methods });
};
