import { ItemResponseType } from 'shared/consts';
import { ConditionalLogic, Config, ResponseValues } from 'shared/state';

export type ReviewProps = {
  answerId: string;
  activityId: string;
};

export type AnswersApiResponse = {
  userPublicKey: string;
  answer: string; // decrypted interface: AnswerDecrypted[]
  itemIds: string[];
  items: [
    {
      question: Record<string, string>;
      responseType: ItemResponseType;
      responseValues: ResponseValues;
      config: Config;
      name: string;
      isHidden: boolean;
      conditionalLogic: ConditionalLogic;
      allowEdit: true;
      id: string;
      order: number;
    },
  ];
};

export type AnswerDecrypted =
  | string
  | { value: string | number | (string | number)[]; text?: string };
