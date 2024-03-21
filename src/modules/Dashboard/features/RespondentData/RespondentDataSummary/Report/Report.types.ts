export type CurrentActivityCompletionData = { answerId: string; date?: number } | null;

export type ReportContextType = {
  currentActivityCompletionData: CurrentActivityCompletionData;
  setCurrentActivityCompletionData: (value: CurrentActivityCompletionData) => void;
};

// TODO: move

// export type FormattedAnswer = {
//   value: string | number | null;
//   text: string | null;
// };
//
// export type Answer = {
//   answer: FormattedAnswer;
//   date: string;
// };
//
// export type ItemOption = {
//   id: string;
//   text: string | number;
//   value: number;
// };
//
// export type NumberSelectionResponseValues = {
//   minValue: number;
//   maxValue: number;
// };
//
// export type ItemResponseValues = {
//   options: ItemOption[];
// } & Partial<NumberSelectionResponseValues>;
//
// export type FormattedActivityItem = {
//   id: string;
//   name: string;
//   question: Record<string, string>;
//   responseType: ItemResponseType;
//   responseValues: ItemResponseValues;
//   responseDataIdentifier?: boolean;
// };
//
// export type FormattedResponse = {
//   activityItem: FormattedActivityItem;
//   answers: Answer[];
//   dataTestid?: string;
// };
