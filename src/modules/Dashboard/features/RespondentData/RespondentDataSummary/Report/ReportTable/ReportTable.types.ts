export type TextItemAnswer = {
  date: string;
  time: string;
  answer: string;
};

export type TextAnswer = {
  answer: string;
  date: string;
};

export type ReportTableProps = {
  answers?: TextAnswer[];
};
