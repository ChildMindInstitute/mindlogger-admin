export type ActivityItemAnswer = {
  activityItemId: string;
  answer: {
    value: string[];
  };
};

export type ActivityItemAnswers = {
  answers: ActivityItemAnswer[];
};
