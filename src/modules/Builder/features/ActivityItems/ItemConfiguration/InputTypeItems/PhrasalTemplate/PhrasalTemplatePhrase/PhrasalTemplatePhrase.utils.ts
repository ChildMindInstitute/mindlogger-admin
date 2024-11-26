import { PhrasalTemplateResponseValuePhraseSchema } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.schema';

export const validatePhraseField = async (field: Record<'id', string>): Promise<boolean> => {
  try {
    await PhrasalTemplateResponseValuePhraseSchema.validate(field);

    return true;
  } catch (error) {
    return false;
  }
};
