export type ActivityItemAnswer = {
  activityItemId: string;
  answer: {
    value: number | string | string[];
  };
};

export type ActivityItemAnswers = {
  answers: ActivityItemAnswer[];
};
