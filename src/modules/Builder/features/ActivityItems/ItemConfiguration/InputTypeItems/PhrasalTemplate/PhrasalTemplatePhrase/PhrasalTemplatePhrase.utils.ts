import { InferType } from 'yup';

import { PhrasalTemplateResponseValuePhraseSchema } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.schema';

export const validatePhraseField = async (
  field: InferType<typeof PhrasalTemplateResponseValuePhraseSchema>,
): Promise<boolean> => {
  try {
    await PhrasalTemplateResponseValuePhraseSchema.validate(field, { abortEarly: false });

    return true;
  } catch (error) {
    return false;
  }
};
